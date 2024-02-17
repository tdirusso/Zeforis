import Stripe from 'stripe';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';

const stripeSecretKey = getEnvVariable(EnvVariable.STRIPE_SECRET_KEY);

export default new Stripe(stripeSecretKey, { apiVersion: '2023-08-16' });
