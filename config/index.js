const isDev = process.env.NODE_ENV !== 'production';

const appLimits = {
    invites: 20
};

const stripeSubscriptionPriceId = 'price_1Nn33sIN8ZcWLYm9bO7hpkxT';

module.exports = {
  isDev,
  appLimits,
  stripeSubscriptionPriceId
};