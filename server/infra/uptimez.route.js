import koaRouter from 'koa-router';

import BaseRoute from '../common/base.route';

export default class UserRoute extends BaseRoute {

  constructor(router) {
    super();
    this.router = router || koaRouter();
  }

  routes() {
    this.router.get('/', async (ctx, next) => {
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

    return this.router.routes();
  }

}
