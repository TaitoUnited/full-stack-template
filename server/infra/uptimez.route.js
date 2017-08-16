import koaRouter from 'koa-router';

import BaseRoute from '../common/base.route';

export default class UserRoute extends BaseRoute {

  routes() {
    this.router.get('/', async (ctx, next) => {
      // Check that database is up
      await ctx.myappCtx.getTx().any(`
        SELECT *
        FROM example_userr
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
