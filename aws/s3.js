const AWS = require('aws-sdk');

const ID = process.env.AWS_KEY_ID;
const SECRET = process.env.AWS_KEY_SECRET;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  params: {
    Bucket: process.env.AWS_S3_BUCKET_NAME
  }
});

module.exports = s3;