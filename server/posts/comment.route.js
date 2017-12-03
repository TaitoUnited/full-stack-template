import BaseRoute from '../common/base.route';
import CommentService from './comment.service';

/**
 * Responsibilities of a route:
 *
 * - Routes http request paths to correct service methods
 * - Gets data from request context and gives it to service
 *   methods as parameters.
 * - Does some additional response formatting if necessary.
 */
export default class PostRoute extends BaseRoute {
  constructor(router, commentService) {
    super(router, '/comments');
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.commentService = commentService || new CommentService();
  }

  routes() {
    // Fetch comments
    this.router.get('/', async (ctx, next) => {
      ctx.body = await this.commentService.fetch(ctx.appCtx, ctx.query);
      next();
    });

    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
