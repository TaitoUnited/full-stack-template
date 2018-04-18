import BaseRoute from '../common/base.route';
import config from '../common/common.config';

export default class InfraRoute extends BaseRoute {
  constructor(router) {
    super(router, '/infra');
  }

  routes() {
    // Return configs that are required by web user interface or
    // 3rd party clients
    this.router.get('/config', async (ctx, next) => {
      ctx.body = {
        APP_VERSION: config.APP_VERSION,
      };
      next();
    });

    // Polled by uptime monitor to check that the system is alive
    this.router.get('/uptimez', async (ctx, next) => {
      // Check that database is up
      await ctx.state.getTx().any(`
        SELECT *
        FROM example_user
        LIMIT 1
      `);
      ctx.body = {
        status: 'OK',
      };
      next();
    });

    // Polled by Kubernetes to check that container is alive
    this.router.get('/healthz', async (ctx, next) => {
      // Check that database connection is up
      // TODO might cause restart automatically also if there is lots of
      // traffic that end up taking all the database connections
      await ctx.state.getTx().any(`
        SELECT *
        FROM example_user
        LIMIT 1
      `);
      ctx.body = {
        status: 'OK',
      };
      next();
    });

    return this.router.routes();
  }
}
