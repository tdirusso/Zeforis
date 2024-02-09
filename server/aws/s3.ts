import AWS from 'aws-sdk';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';

const id = getEnvVariable(EnvVariable.AWS_KEY_ID);
const secret = getEnvVariable(EnvVariable.AWS_KEY_SECRET);
const bucket = getEnvVariable(EnvVariable.AWS_S3_BUCKET_NAME);

const s3 = new AWS.S3({
  accessKeyId: id,
  secretAccessKey: secret,
  params: {
    Bucket: bucket
  }
});

export default s3;