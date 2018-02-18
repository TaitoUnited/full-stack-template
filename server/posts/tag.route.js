import BaseRoute from '../common/base.route';
import TagService from './tag.service';

/**
 * Responsibilities of a route:
 *
 * - Routes http request paths to correct service methods
 * - Gets data from request context and gives it to service
 *   methods as parameters.
 * - Does some additional response formatting if necessary.
 */
export default class PostRoute extends BaseRoute {
  constructor(router, tagService) {
    super(router, '/tags');
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.tagService = tagService || new TagService();
  }

  routes() {
    // Fetch tags
    this.router.get('/', async (ctx, next) => {
      ctx.body = await this.tagService.fetch(ctx.state, ctx.query);
      next();
    });

    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
