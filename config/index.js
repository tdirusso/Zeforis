const isDev = process.env.NODE_ENV !== 'production';

const appLimits = {
  simultaneousEmailInvites: 20,
  freePlanTasks: 200,
  freePlanEngagements: 1
};

const stripeSubscriptionPriceId = 'price_1Nn33sIN8ZcWLYm9bO7hpkxT';
const stripeCustomerPortalUrl = 'https://billing.stripe.com/p/login/test_9AQ29haPEen8f7iaEE';

module.exports = {
  isDev,
  appLimits,
  stripeSubscriptionPriceId,
  stripeCustomerPortalUrl
};