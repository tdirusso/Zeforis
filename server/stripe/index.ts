import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Environment variable missing:  "STRIPE_SECRET_KEY"');
}

export default new Stripe(stripeSecretKey, { apiVersion: '2023-08-16' });
