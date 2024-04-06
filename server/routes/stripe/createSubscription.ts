import stripe from '../../stripe';
import { pool, commonQueries } from '../../database';
import { stripeSubscriptionPriceId } from '../../config';
import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { RowDataPacket } from 'mysql2';
import { NotFoundError } from '../../types/Errors';

export default async (req: Request, res: Response, next: NextFunction) => {

  const {
    numAdmins
  } = req.body;

  const {
    org,
    userId
  } = req;

  if (!userId || !org) {
    return res.json({
      message: 'Missing user or org data.'
    });
  }

  const connection = await pool.getConnection();

  const orgOwnerPlan = await commonQueries.getOrgOwnerPlan(connection, org.id);

  if (orgOwnerPlan !== 'free') {
    return res.json({
      message: 'You are already on a paid Zeforis plan.  Please update the subscription instead.'
    });
  }

  if (!numAdmins || typeof numAdmins !== 'number' || numAdmins <= 0 || numAdmins >= 10000) {
    return res.json({
      message: 'Number of administrators is invalid.'
    });
  }

  try {
    const orgAdminsCount = await commonQueries.getOrgAdminCount(pool, org.id);

    if (numAdmins < orgAdminsCount) {
      return res.json({
        message: `Number of admins must be >= ${orgAdminsCount}.  Received ${numAdmins}.`
      });
    }

    let customer = null;

    const [userResult] = await pool.query<RowDataPacket[]>(
      'SELECT first_name AS firstName, last_name AS lastName, email FROM users WHERE id = ?',
      [userId]);

    if (!userResult.length) {
      throw new NotFoundError(`User with id ${userId} not found.`);
    }

    const user = userResult[0];

    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    if (customers.data.length) {
      customer = customers.data[0];
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          'Zeforis User ID': user.id,
          'Organization ID': org.id,
          'Organization Name': org.name
        }
      });

      await pool.query('UPDATE users SET stripe_customerId = ? WHERE id = ?', [newCustomer.id, userId]);

      customer = newCustomer;
    }

    const existingSubscriptions = (await stripe.subscriptions.list({
      customer: customer.id,
      limit: 100,
      expand: ['data.latest_invoice.payment_intent']
    })).data;

    if (existingSubscriptions.length) {
      for (const existingSubscription of existingSubscriptions) {
        if (existingSubscription.status === 'incomplete') {
          const latestInvoice = existingSubscription.latest_invoice as Stripe.Invoice;

          if (latestInvoice.payment_intent) {
            const intent = latestInvoice.payment_intent as Stripe.PaymentIntent;

            return res.json({
              clientSecret: intent.client_secret
            });
          } else {
            return res.json({ hasSubscription: true });
          }
        }
      }

      return res.json({ hasSubscription: true });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: stripeSubscriptionPriceId,
        quantity: numAdmins
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      proration_behavior: 'none'
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const intent = invoice.payment_intent as Stripe.PaymentIntent;

    return res.json({
      clientSecret: intent.client_secret
    });
  } catch (error) {
    next(error);
  }
};