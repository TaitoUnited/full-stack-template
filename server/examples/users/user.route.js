import koaRouter from 'koa-router';

import BaseRoute from '../../common/base.route';
import UserService from './user.service';

/**
 * Responsibilities of a route:
 *
 * - Routes http request paths to correct service methods
 * - Gets data from request context and gives it to service
 *   methods as parameters.
 * - Does some additional response formatting if necessary.
 */
export default class UserRoute extends BaseRoute {

  constructor(router, userService) {
    super(router);
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.userService = userService || new UserService();
  }

  routes() {
    this.router.get('/:id', async (ctx, next) => {
      ctx.body = await this.userService.read(ctx.myappCtx, ctx.params.id);
      next();
    });

    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }

}
