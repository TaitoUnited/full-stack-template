import BaseRoute from '../common/base.route';

export default class UserRoute extends BaseRoute {

  routes() {
    // Polled by uptime monitor to check that the system is alive
    this.router.get('/uptimez', async (ctx, next) => {
      // Check that database is up
      await ctx.myappCtx.getTx().any(`
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
      ctx.body = {
        status: 'OK',
      };
      next();
    });

    return this.router.routes();
  }

}
