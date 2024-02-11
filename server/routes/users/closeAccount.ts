import { RowDataPacket } from 'mysql2';
import { pool } from '../../database';
import stripe from '../../stripe';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;

  if (!userId) {
    return res.json({
      message: 'Missing userId.'
    });
  }

  try {
    const [stripeCustomerIdResult] = await pool.query<RowDataPacket[]>('SELECT stripe_customerId FROM users WHERE id = ?', [userId]);

    const customerId = stripeCustomerIdResult[0].stripe_customerId;

    if (customerId) {
      const subscriptions = (await stripe.subscriptions.list({
        customer: customerId
      })).data;

      const subscription = subscriptions.find(sub => sub.status === 'active' || sub.status === 'past_due');

      if (subscription) {
        await stripe.subscriptions.cancel(subscription.id, {
          cancellation_details: {
            comment: 'Canceled due to account closure.'
          },
          prorate: false
        });
      }
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};