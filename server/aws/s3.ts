import { S3Client } from '@aws-sdk/client-s3';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';

const id = getEnvVariable(EnvVariable.AWS_KEY_ID);
const secret = getEnvVariable(EnvVariable.AWS_KEY_SECRET);
const region = getEnvVariable(EnvVariable.AWS_S3_BUCKET_REGION);

const s3 = new S3Client({
  credentials: {
    accessKeyId: id,
    secretAccessKey: secret
  },
  region
});

export default s3;