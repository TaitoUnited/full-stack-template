import { ParameterizedContext } from 'koa';
import BaseRouter from '../common/BaseRouter';

import config from '../common/config';

class InfraRouter extends BaseRouter {
  constructor() {
    super();
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
      handler: async (ctx: ParameterizedContext) => {
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
            body: {
              status: this.Joi.string()
                .only('OK')
                .required(),
            },
          },
        },
      },
      handler: async (ctx: ParameterizedContext) => {
        // Check that database is up
        await ctx.state.db.any('SELECT 1');
        await ctx.state.storage
          .headBucket({ Bucket: config.S3_BUCKET })
          .promise();
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
            body: {
              status: this.Joi.string()
                .only('OK')
                .required(),
            },
          },
        },
      },
      handler: async (ctx: ParameterizedContext) => {
        ctx.response.body = {
          status: 'OK',
        };
      },
    });
  }
}

export default InfraRouter;
