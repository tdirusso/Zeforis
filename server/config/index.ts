const isDev = process.env.NODE_ENV !== 'production';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env' });
}

const appLimits = {
  freePlanTasks: 200,
  freePlanEngagements: 1
};

const stripeSubscriptionPriceId = getEnvVariable(EnvVariable.STRIPE_SUBSCRIPTION_PRICE_ID);

const pricePerAdminMonthly = 7.50;

export {
  isDev,
  appLimits,
  stripeSubscriptionPriceId,
  pricePerAdminMonthly
};