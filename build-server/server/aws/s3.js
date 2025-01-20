"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const EnvVariable_1 = require("../types/EnvVariable");
const id = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.AWS_KEY_ID);
const secret = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.AWS_KEY_SECRET);
const region = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.AWS_S3_BUCKET_REGION);
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: id,
        secretAccessKey: secret
    },
    region
});
exports.default = s3;
