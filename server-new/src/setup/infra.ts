import { HeadBucketCommand } from '@aws-sdk/client-s3';
import { Type } from '@sinclair/typebox';
import { sql } from 'drizzle-orm';

import { config } from '~/common/config';
import { getStoragesById } from '~/common/storage';
import { type ServerInstance } from './server';

export async function infraRoutes(server: ServerInstance) {
  server.route({
    method: 'GET',
    url: '/config',
    schema: {
      response: {
        200: Type.Object({
          data: Type.Object({ APP_VERSION: Type.String() }),
        }),
      },
    },
    handler: async () => {
      return {
        data: {
          APP_VERSION: config.APP_VERSION,
        },
      };
    },
  });

  server.route({
    method: 'GET',
    url: '/uptimez',
    schema: {
      response: {
        200: Type.Object({ status: Type.String() }),
      },
    },
    handler: async ({ ctx }) => {
      // Check database
      await ctx.db.execute(sql`SELECT 1`);

      // Check storage buckets
      const storagesById = await getStoragesById();
      const { bucketName, s3 } = storagesById.bucket;
      await s3.send(new HeadBucketCommand({ Bucket: bucketName }));

      return { status: 'OK' };
    },
  });

  server.route({
    method: 'GET',
    url: '/healthz',
    schema: {
      response: {
        200: Type.Object({ status: Type.String() }),
      },
    },
    handler: async () => {
      return { status: 'OK' };
    },
  });
}
