import { Context } from 'koa';
import { Service } from 'typedi';
import { HeadBucketCommand } from '@aws-sdk/client-s3';
import BaseRouter from '../../common/setup/BaseRouter';

import config from '../../common/setup/config';
import getStoragesById from '../../common/setup/storage';

@Service()
class InfraRouter extends BaseRouter {
  constructor(router: any = null) {
    super(router);
    this.group = 'Infra';
    this.setupRoutes();
  }

  private setupRoutes() {
    this.route({
      method: 'get',
      path: '/config',
      documentation: {
        description:
          'Return configs that are required by web user interface or 3rd party clients',
      },
      validate: {
        output: {
          200: {
            body: this.Joi.object({
              data: this.Joi.object({
                APP_VERSION: this.Joi.string().required(),
              }).required(),
            }),
          },
        },
      },
      handler: async (ctx: Context) => {
        // NOTE: This is a public endpoint. Do not return any secrets here!
        ctx.response.body = {
          data: {
            APP_VERSION: config.APP_VERSION,
          },
        };
      },
    });

    this.route({
      method: 'get',
      path: '/uptimez',
      documentation: {
        description:
          'Polled by uptime monitor to check that the system is alive',
      },
      validate: {
        output: {
          '200': {
            body: this.Joi.object({
              status: this.Joi.string().valid('OK').required(),
            }),
          },
        },
      },
      handler: async (ctx: Context) => {
        // Check database
        await ctx.state.tx.any('SELECT 1');
        // Check storage buckets
        const storagesById = await getStoragesById();
        const { bucketName, s3 } = storagesById.bucket;
        await s3.send(new HeadBucketCommand({ Bucket: bucketName }));

        ctx.response.body = {
          status: 'OK',
        };
      },
    });

    this.route({
      method: 'get',
      path: '/healthz',
      documentation: {
        description:
          'Polled by Kubernetes to check that the container is alive',
      },
      validate: {
        output: {
          '200': {
            body: this.Joi.object({
              status: this.Joi.string().valid('OK').required(),
            }),
          },
        },
      },
      handler: async (ctx: Context) => {
        ctx.response.body = {
          status: 'OK',
        };
      },
    });
  }
}

export default InfraRouter;
