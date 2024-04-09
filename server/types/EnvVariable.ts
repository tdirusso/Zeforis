export enum EnvVariable {
  API_DOMAIN = 'API_DOMAIN',
  APP_DOMAIN = 'APP_DOMAIN',
  SECRET_KEY = 'SECRET_KEY',
  AWS_KEY_ID = 'AWS_KEY_ID',
  AWS_KEY_SECRET = 'AWS_KEY_SECRET',
  AWS_S3_BUCKET_NAME = 'AWS_S3_BUCKET_NAME',
  AWS_S3_ORG_LOGO_FOLDER = 'AWS_S3_ORG_LOGO_FOLDER',
  AWS_S3_BUCKET_REGION = 'AWS_S3_BUCKET_REGION',
  SENDGRID_API_KEY = 'SENDGRID_API_KEY',
  EMAIL_SENDER_INFO = 'EMAIL_SENDER_INFO',
  EMAIL_SENDER_ERROR = 'EMAIL_SENDER_ERROR',
  MYSQL_HOST = 'MYSQL_HOST',
  MYSQL_USER = 'MYSQL_USER',
  MYSQL_PASSWORD = 'MYSQL_PASSWORD',
  MYSQL_DATABASE = 'MYSQL_DATABASE',
  GOOGLE_OAUTH_CLIENT_ID = 'GOOGLE_OAUTH_CLIENT_ID',
  GOOGLE_OAUTH_CLIENT_SECRET = 'GOOGLE_OAUTH_CLIENT_SECRET',
  SLACK_SIGNING_SECRET = 'SLACK_SIGNING_SECRET',
  SLACK_BOT_OAUTH_TOKEN = 'SLACK_BOT_OAUTH_TOKEN',
  STRIPE_SECRET_KEY = 'STRIPE_SECRET_KEY',
  STRIPE_WEBHOOK_SECRET = 'STRIPE_WEBHOOK_SECRET',
  STRIPE_SUBSCRIPTION_PRICE_ID = 'STRIPE_SUBSCRIPTION_PRICE_ID',
};

export function getEnvVariable(envVar: EnvVariable) {
  const value = process.env[envVar];

  if (value === undefined) {
    throw new Error(`Environment variable missing: ${envVar}`);
  }

  return value;
}