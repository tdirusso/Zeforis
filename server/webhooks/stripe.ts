import { pool } from '../database';
import stripe from '../stripe';
import slackbot from '../slackbot';
import cache from '../cache';
import { pricePerAdminMonthly } from '../config';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { EnvVariable, getEnvVariable } from '../types/EnvVariable';

const webhookSecret = getEnvVariable(EnvVariable.STRIPE_WEBHOOK_SECRET);

if (!webhookSecret) {
  throw new Error(`Environment variable missing:  ${EnvVariable.STRIPE_WEBHOOK_SECRET}`);
}

export default async (req: Request, res: Response, next: NextFunction) => {

  let event = req.body;

  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(401).json({ message: 'Unauthorized request - missing required header:  "stripe-signature"' });
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Stripe webhook signature verification failed - `, error.message);
    }
    return res.status(400).json({ message: 'Stripe webhook signature verification failed.' });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.deleted': {
        const { customer, plan, quantity } = event.data.object;

        if (customer) {
          const [userResult] = await pool.query<RowDataPacket[]>(
            'SELECT id, email FROM users WHERE stripe_customerId = ?',
            [customer]
          );

          const user = userResult[0];

          if (user) {
            await pool.query('UPDATE users SET stripe_subscription_status = "canceled", plan = "free" WHERE id = ?', [user.id]);

            const [ownedOrgs] = await pool.query<RowDataPacket[]>('SELECT id FROM orgs WHERE owner_id = ?', [user.id]);

            ownedOrgs.forEach(({ id }) => {
              let cachedOrgData = cache.get(`org-${id}`);
              if (cachedOrgData) {
                cache.set(`org-${id}`, { ...cachedOrgData, ownerPlan: 'free' });
              }
            });

            await slackbot.post({
              channel: slackbot.channels.events,
              message: `*Subscription Canceled* 😢\n*Amount:*  -${((plan.amount * quantity) / 100).toLocaleString('en', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}\n*Email:*  ${user.email}`
            });
          }
        }
        break;
      }
      case 'customer.subscription.updated': {
        const { customer, status, quantity } = event.data.object;
        const { previous_attributes } = event.data;

        if (status === 'past_due' && customer) {
          const [userResult] = await pool.query<RowDataPacket[]>(
            'SELECT id, email FROM users WHERE stripe_customerId = ?',
            [customer]
          );

          const user = userResult[0];

          if (user) {
            await pool.query('UPDATE users SET stripe_subscription_status = "past_due" WHERE id = ?', [user.id]);

            await slackbot.post({
              channel: slackbot.channels.events,
              message: `*Subscription Past Due* 😧\n*Email:*  ${user.email}`
            });
          }
        } else if (previous_attributes && previous_attributes.quantity) {
          const prevQuantity = previous_attributes.quantity;

          if (prevQuantity !== quantity) {

            const [userResult] = await pool.query<RowDataPacket[]>(
              'SELECT email FROM users WHERE stripe_customerId = ?',
              [customer]
            );

            const user = userResult[0];

            if (user) {
              if (prevQuantity < quantity) {
                await slackbot.post({
                  channel: slackbot.channels.events,
                  message: `*Subscription Updated - ${quantity - prevQuantity} Administrators Added* 🤑\n*Amount:*  ${(prevQuantity * pricePerAdminMonthly).toLocaleString('en', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ---> ${(quantity * pricePerAdminMonthly).toLocaleString('en', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}\n*Email:*  ${user.email}`
                });
              } else if (prevQuantity > quantity) {
                await slackbot.post({
                  channel: slackbot.channels.events,
                  message: `*Subscription Updated - ${prevQuantity - quantity} Administrators Removed* 😢\n*Amount:*  ${(prevQuantity * pricePerAdminMonthly).toLocaleString('en', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ---> ${(quantity * pricePerAdminMonthly).toLocaleString('en', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}\n*Email:*  ${user.email}`
                });
              }
            }
          }
        }

        break;
      }
      case 'invoice.paid':
        {
          const { customer, amount_paid } = event.data.object;

          if (customer) {
            const [userResult] = await pool.query<RowDataPacket[]>(
              'SELECT id, email FROM users WHERE stripe_customerId = ?',
              [customer]
            );

            const user = userResult[0];

            if (user) {
              await pool.query('UPDATE users SET stripe_subscription_status = "active", plan = "pro" WHERE id = ?', [user.id]);

              const [ownedOrgs] = await pool.query<RowDataPacket[]>('SELECT id FROM orgs WHERE owner_id = ?', [user.id]);

              ownedOrgs.forEach(({ id }) => {
                let cachedOrgData = cache.get(`org-${id}`);
                if (cachedOrgData) {
                  cache.set(`org-${id}`, { ...cachedOrgData, ownerPlan: 'pro' });
                }
              });

              await slackbot.post({
                channel: slackbot.channels.events,
                message: `*New Subscription Payment* 🤑\n*Amount:*  ${(amount_paid / 100).toLocaleString('en', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}\n*Email:*  ${user.email}`
              });
            }
          }
          break;
        }
      default:
        break;
    }

    return res.send();
  } catch (error) {
    next(error);
    return res.sendStatus(400);
  }
};
