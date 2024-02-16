export enum EnvVariable {
  REACT_APP_API_DOMAIN = 'REACT_APP_API_DOMAIN',
  REACT_APP_APP_DOMAIN = 'REACT_APP_APP_DOMAIN',
  REACT_APP_GOOGLE_OAUTH_CLIENT_ID = 'REACT_APP_GOOGLE_OAUTH_CLIENT_ID',
  REACT_APP_STRIPE_PK = 'REACT_APP_STRIPE_PK',
  REACT_APP_STRIPE_CUSTOMER_PORTAL_URL = 'REACT_APP_STRIPE_CUSTOMER_PORTAL_URL'
};

export function getEnvVariable(envVar: EnvVariable) {
  const value = process.env[envVar];

  if (value === undefined) {
    throw new Error(`Environment variable missing: "${envVar}"`);
  }

  return value;
}