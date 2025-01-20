"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricePerAdminMonthly = exports.stripeSubscriptionPriceId = exports.appLimits = exports.isDev = void 0;
const isDev = process.env.NODE_ENV !== 'production';
exports.isDev = isDev;
const EnvVariable_1 = require("../types/EnvVariable");
if (isDev) {
    require('dotenv').config({ path: __dirname + '/../.env' });
}
const appLimits = {
    freePlanTasks: 200,
    freePlanEngagements: 1
};
exports.appLimits = appLimits;
const stripeSubscriptionPriceId = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.STRIPE_SUBSCRIPTION_PRICE_ID);
exports.stripeSubscriptionPriceId = stripeSubscriptionPriceId;
const pricePerAdminMonthly = 7.50;
exports.pricePerAdminMonthly = pricePerAdminMonthly;
