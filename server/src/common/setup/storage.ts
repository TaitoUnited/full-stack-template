import AWS from 'aws-sdk';
import config, { getSecrets } from './config';

let storagesById: any = null;

const getStoragesById = async () => {
  if (storagesById) {
    return storagesById;
  }

  const secrets = await getSecrets();
  if (!storagesById) {
    storagesById = {
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
          secretAccessKey: secrets.BUCKET_KEY_SECRET,
          params: {
            Bucket: config.BUCKET_BUCKET,
          },
        }),
      },
      // NOTE: Add additional storage buckets here
    };
  }

  return storagesById;
};

export default getStoragesById;
