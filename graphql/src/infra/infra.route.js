import BaseRoute from '../common/base.route';

export default class InfraRoute extends BaseRoute {
  constructor(router) {
    super(router, '');
  }

  routes() {
    // Return configs that are required by web user interface or
    // 3rd party clients
    // NOTE: This is a public endpoint. Do not return any secrets here!
    this.router.get('/config', async (ctx, next) => {
      ctx.body = {};
      next();
    });

    // Polled by uptime monitor to check that the system is alive
    this.router.get('/uptimez', async (ctx, next) => {
      ctx.body = {
        status: 'OK',
      };
      next();
    });

    // Polled by Kubernetes to check that the container is alive
    this.router.get('/healthz', async (ctx, next) => {
      ctx.body = {
        status: 'OK',
      };
      next();
    });

    return this.router.routes();
  }
}
