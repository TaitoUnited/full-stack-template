import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
// import { Bucket, Storage } from '@google-cloud/storage';

import { config, getSecrets } from './config';

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
function getStorageBucketInfo(options: {
  bucketName: string;
  gcpProjectId: string | null;
  gcpServiceAccountKey: string | null;
  s3Params: S3ClientConfig;
}): StorageBucketInfo {
  const s3 = new S3Client(options.s3Params);
  const endpoint = options.s3Params.endpoint?.toString() || null;

  return {
    bucketName: options.bucketName,
    gcpProjectId: options.gcpProjectId,
    // Client for S3 operations
    s3,
    // Client for signing S3 urls
    s3signer:
      endpoint && endpoint.startsWith('http://')
        ? new S3Client({
            ...options.s3Params,
            endpoint: `http://localhost:${config.COMMON_PUBLIC_PORT}`,
          })
        : s3,
    // OPTIONAL: Client for GCS specific operations
    /*
    gcs:
      options.gcpProjectId && options.gcpServiceAccountKey
        ? new Storage({
            projectId: options.gcpProjectId,
            credentials: JSON.parse(options.gcpServiceAccountKey),
          }).bucket(bucketName)
        : null,
    */
  };
}

let storagesById: { bucket: StorageBucketInfo } | null = null;

/**
 * Returns all storage buckets configured for the application
 */
export async function getStoragesById() {
  if (storagesById) {
    return storagesById;
  }

  const secrets = await getSecrets();

  if (!storagesById) {
    storagesById = {
      bucket: getStorageBucketInfo({
        bucketName: config.BUCKET_BUCKET,
        gcpProjectId: config.BUCKET_GCP_PROJECT_ID,
        gcpServiceAccountKey: secrets.SERVICE_ACCOUNT_KEY,
        s3Params: {
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
        },
      }),
      // NOTE: Add additional storage buckets here
    };
  }

  return storagesById;
}
