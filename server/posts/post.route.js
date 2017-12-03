import BaseRoute from '../common/base.route';
import PostService from './post.service';

/**
 * Responsibilities of a route:
 *
 * - Routes http request paths to correct service methods
 * - Gets data from request context and gives it to service
 *   methods as parameters.
 * - Does some additional response formatting if necessary.
 */
export default class PostRoute extends BaseRoute {
  constructor(router, postService) {
    super(router, '/posts');
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.postService = postService || new PostService();
  }

  routes() {
    // Fetch posts
    this.router.get('/', async (ctx, next) => {
      ctx.body = await this.postService.fetch(ctx.appCtx, ctx.query);
      next();
    });

    // Create a post
    this.router.post('/', async (ctx, next) => {
      // TODO quick temp hack
      ctx.body = await this.postService.create(ctx.appCtx, ctx.request.fields);
      next();
    });

    // Read a post
    this.router.get('/:id', async (ctx, next) => {
      ctx.body = await this.postService.read(ctx.appCtx, ctx.params.id);
      next();
    });

    // Update a post (full update)
    this.router.put('/:id', async (ctx, next) => {
      ctx.body = await this.postService.update(ctx.appCtx, {
        ...ctx.request.fields,
        id: ctx.params.id
      });
      next();
    });

    // Patch a post (partial update)
    this.router.patch('/:id', async (ctx, next) => {
      ctx.body = await this.postService.patch(ctx.appCtx, {
        ...ctx.request.fields,
        id: ctx.params.id
      });
      next();
    });

    // Delete a post
    this.router.delete('/:id', async (ctx, next) => {
      ctx.body = await this.postService.read(ctx.appCtx, ctx.params.id);
      next();
    });

    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
