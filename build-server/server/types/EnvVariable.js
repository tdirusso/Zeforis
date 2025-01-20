"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVariable = exports.EnvVariable = void 0;
var EnvVariable;
(function (EnvVariable) {
    EnvVariable["API_DOMAIN"] = "API_DOMAIN";
    EnvVariable["APP_DOMAIN"] = "APP_DOMAIN";
    EnvVariable["SECRET_KEY"] = "SECRET_KEY";
    EnvVariable["AWS_KEY_ID"] = "AWS_KEY_ID";
    EnvVariable["AWS_KEY_SECRET"] = "AWS_KEY_SECRET";
    EnvVariable["AWS_S3_BUCKET_NAME"] = "AWS_S3_BUCKET_NAME";
    EnvVariable["AWS_S3_ORG_LOGO_FOLDER"] = "AWS_S3_ORG_LOGO_FOLDER";
    EnvVariable["AWS_S3_BUCKET_REGION"] = "AWS_S3_BUCKET_REGION";
    EnvVariable["SENDGRID_API_KEY"] = "SENDGRID_API_KEY";
    EnvVariable["EMAIL_SENDER_INFO"] = "EMAIL_SENDER_INFO";
    EnvVariable["EMAIL_SENDER_ERROR"] = "EMAIL_SENDER_ERROR";
    EnvVariable["MYSQL_HOST"] = "MYSQL_HOST";
    EnvVariable["MYSQL_USER"] = "MYSQL_USER";
    EnvVariable["MYSQL_PASSWORD"] = "MYSQL_PASSWORD";
    EnvVariable["MYSQL_DATABASE"] = "MYSQL_DATABASE";
    EnvVariable["GOOGLE_OAUTH_CLIENT_ID"] = "GOOGLE_OAUTH_CLIENT_ID";
    EnvVariable["GOOGLE_OAUTH_CLIENT_SECRET"] = "GOOGLE_OAUTH_CLIENT_SECRET";
    EnvVariable["SLACK_SIGNING_SECRET"] = "SLACK_SIGNING_SECRET";
    EnvVariable["SLACK_BOT_OAUTH_TOKEN"] = "SLACK_BOT_OAUTH_TOKEN";
    EnvVariable["STRIPE_SECRET_KEY"] = "STRIPE_SECRET_KEY";
    EnvVariable["STRIPE_WEBHOOK_SECRET"] = "STRIPE_WEBHOOK_SECRET";
    EnvVariable["STRIPE_SUBSCRIPTION_PRICE_ID"] = "STRIPE_SUBSCRIPTION_PRICE_ID";
})(EnvVariable = exports.EnvVariable || (exports.EnvVariable = {}));
;
function getEnvVariable(envVar) {
    const value = process.env[envVar];
    if (value === undefined) {
        throw new Error(`Environment variable missing: ${envVar}`);
    }
    return value;
}
exports.getEnvVariable = getEnvVariable;
