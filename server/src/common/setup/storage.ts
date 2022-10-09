import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
// import { Bucket, Storage } from '@google-cloud/storage';
import config, { getSecrets } from './config';

type StorageBucketInfo = {
  bucketName: string;
  gcpProjectId: string | null;
  s3: S3Client; // Client for S3 operations
  s3signer: S3Client; // Client for signing S3 urls
  // gcs: Bucket | null; // OPTIONAL: Client for GCS specific operations
};

/**
 * Creates StorageBucketInfo for the given storage bucket
 */
const getStorageBucketInfo = (
  bucketName: string,
  gcpProjectId: string | null,
  gcpServiceAccountKey: string | null,
  s3Params: S3ClientConfig
): StorageBucketInfo => {
  const s3 = new S3Client(s3Params);
  const endpoint = s3Params.endpoint?.toString() || null;
  return {
    bucketName,
    gcpProjectId,
    // Client for S3 operations
    s3,
    // Client for signing S3 urls
    s3signer:
      endpoint && endpoint.startsWith('http://')
        ? new S3Client({
            ...s3Params,
            endpoint: `http://localhost:${config.COMMON_PUBLIC_PORT}`,
          })
        : s3,
    // OPTIONAL: Client for GCS specific operations
    // gcs:
    //   gcpProjectId && gcpServiceAccountKey
    //     ? new Storage({
    //         projectId: gcpProjectId,
    //         credentials: JSON.parse(gcpServiceAccountKey),
    //       }).bucket(bucketName)
    //     : null,
  };
};

let storagesById: Record<string, StorageBucketInfo> | null = null;

/**
 * Returns all storage buckets configured for the application
 */
export const getStoragesById = async () => {
  if (storagesById) {
    return storagesById;
  }

  const secrets = await getSecrets();
  if (!storagesById) {
    storagesById = {
      bucket: getStorageBucketInfo(
        config.BUCKET_BUCKET,
        config.BUCKET_GCP_PROJECT_ID,
        secrets.SERVICE_ACCOUNT_KEY,
        {
          forcePathStyle: config.BUCKET_FORCE_PATH_STYLE,
          endpoint: config.BUCKET_ENDPOINT,
          region: config.BUCKET_REGION,
          credentials:
            config.BUCKET_KEY_ID && secrets.BUCKET_KEY_SECRET
              ? {
                  accessKeyId: config.BUCKET_KEY_ID,
                  secretAccessKey: secrets.BUCKET_KEY_SECRET,
                }
              : undefined,
        }
      ),
      // NOTE: Add additional storage buckets here
    };
  }

  return storagesById;
};

export default getStoragesById;
