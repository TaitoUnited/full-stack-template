import BaseRoute from '../common/base.route';
import PostService from './post.service';

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
      const data = await this.postService.fetch(ctx.state, ctx.query);
      ctx.body = data;
      next();
    });

    // Create a post
    this.router.post('/', async (ctx, next) => {
      const data = await this.postService.create(ctx.state, ctx.request.body);
      ctx.body = { data };
      next();
    });

    // Read a post
    this.router.get('/:id', async (ctx, next) => {
      const data = await this.postService.read(ctx.state, ctx.params.id);
      ctx.body = { data };
      next();
    });

    // Update a post (full update)
    this.router.put('/:id', async (ctx, next) => {
      const data = await this.postService.update(ctx.state, {
        ...ctx.request.body,
        id: ctx.params.id,
      });
      ctx.body = { data };
      next();
    });

    // Patch a post (partial update)
    this.router.patch('/:id', async (ctx, next) => {
      const data = await this.postService.patch(ctx.state, {
        ...ctx.request.body,
        id: ctx.params.id,
      });
      ctx.body = { data };
      next();
    });

    // Delete a post
    this.router.delete('/:id', async (ctx, next) => {
      const data = await this.postService.read(ctx.state, ctx.params.id);
      ctx.body = { data };
      next();
    });

    return this.router.routes();
  }
}
