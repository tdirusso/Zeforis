const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

const appLimits = {
  simultaneousEmailInvites: 20,
  freePlanTasks: 200,
  freePlanEngagements: 1
};

const stripeSubscriptionPriceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

const pricePerAdminMonthly = 7.50;

module.exports = {
  isDev,
  appLimits,
  stripeSubscriptionPriceId,
  pricePerAdminMonthly
};