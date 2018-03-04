import BaseRoute from '../common/base.route';
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
    super(router, '/users');
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.userService = userService || new UserService();
  }

  routes() {
    // Fetch users
    this.router.get('/', async (ctx, next) => {
      ctx.body = await this.userService.fetch(ctx.state, ctx.query);
      next();
    });

    // Create a user
    this.router.post('/', async (ctx, next) => {
      ctx.body = await this.userService.create(ctx.state, ctx.request.fields);
      next();
    });

    // Read a user
    this.router.get('/:id', async (ctx, next) => {
      ctx.body = await this.userService.read(ctx.state, ctx.params.id);
      next();
    });

    // Update a user (full update)
    this.router.put('/:id', async (ctx, next) => {
      ctx.body = await this.userService.update(ctx.state, {
        ...ctx.request.fields,
        id: ctx.params.id,
      });
      next();
    });

    // Patch a user (partial update)
    this.router.patch('/:id', async (ctx, next) => {
      ctx.body = await this.userService.patch(ctx.state, {
        ...ctx.request.fields,
        id: ctx.params.id,
      });
      next();
    });

    // Delete a user
    this.router.delete('/:id', async (ctx, next) => {
      ctx.body = await this.userService.read(ctx.state, ctx.params.id);
      next();
    });

    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
