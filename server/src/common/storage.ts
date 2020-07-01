import AWS from 'aws-sdk';
import config from './config';

const storagesById = {
  bucket: {
    bucket: config.BUCKET_BUCKET,
    browseUrl: config.BUCKET_BROWSE_URL,
    downloadUrl: config.BUCKET_DOWNLOAD_URL,
    s3: new AWS.S3({
      signatureVersion: 'v4',
      s3ForcePathStyle: config.BUCKET_FORCE_PATH_STYLE,
      endpoint: config.BUCKET_URL,
      region: config.BUCKET_REGION,
      accessKeyId: config.BUCKET_KEY_ID,
      secretAccessKey: config.BUCKET_KEY_SECRET,
      params: {
        Bucket: config.BUCKET_BUCKET,
      },
    }),
  },
  // NOTE: Add additional storage buckets here
};

export default storagesById;
