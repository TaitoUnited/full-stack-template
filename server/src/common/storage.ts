import AWS from 'aws-sdk';
import config from './config';

const storage = new AWS.S3({
  signatureVersion: 'v4',
  s3ForcePathStyle: config.S3_FORCE_PATH_STYLE,
  endpoint: config.S3_URL,
  region: config.S3_REGION,
  accessKeyId: config.S3_KEY_ID,
  secretAccessKey: config.S3_KEY_SECRET,
  params: {
    Bucket: config.S3_BUCKET,
  },
});

export default storage;
