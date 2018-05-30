import BaseRoute from '../common/base.route';
import ImageService from './service';

/**
 * Responsibilities of a route:
 *
 * - Routes http request paths to correct service methods
 * - Gets data from request context and gives it to service
 *   methods as parameters.
 * - Does some additional response formatting if necessary.
 */
export default class imageRoute extends BaseRoute {
  constructor(router, imageService) {
    super(router, '/images');
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.imageService = imageService || new ImageService();
  }

  routes() {
    // Fetch images
    this.router.get('/', async (ctx, next) => {
      const data = await this.imageService.fetch(ctx.state, ctx.query);
      ctx.body = { data, totalCount: 100 };
      next();
    });

    // Create a image
    this.router.post('/', async (ctx, next) => {
      const data = await this.imageService.create(
        ctx.state,
        ctx.request.fields
      );
      ctx.body = { data };
      next();
    });

    // Read a image
    this.router.get('/:id', async (ctx, next) => {
      const data = await this.imageService.read(ctx.state, ctx.params.id);
      ctx.body = { data };
      next();
    });

    // Update a image (full update)
    this.router.put('/:id', async (ctx, next) => {
      const data = await this.imageService.update(ctx.state, {
        ...ctx.request.fields,
        id: ctx.params.id,
      });
      ctx.body = { data };
      next();
    });

    // Patch a image (partial update)
    this.router.patch('/:id', async (ctx, next) => {
      const data = await this.imageService.patch(ctx.state, {
        ...ctx.request.fields,
        id: ctx.params.id,
      });
      ctx.body = { data };
      next();
    });

    // Delete a image
    this.router.delete('/:id', async (ctx, next) => {
      const data = await this.imageService.read(ctx.state, ctx.params.id);
      ctx.body = { data };
      next();
    });

    return this.router.routes();
  }
}
