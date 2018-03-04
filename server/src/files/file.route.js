import BaseRoute from '../common/base.route';
import FileService from './file.service';

/**
 * Responsibilities of a route:
 *
 * - Routes http request paths to correct service methods
 * - Gets data from request context and gives it to service
 *   methods as parameters.
 * - Does some additional response formatting if necessary.
 */
export default class FileRoute extends BaseRoute {
  constructor(router, fileService) {
    super(router, '/files');
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.fileService = fileService || new FileService();
  }

  routes() {
    // Fetch files
    this.router.get('/', async (ctx, next) => {
      ctx.body = await this.fileService.fetch(ctx.state, ctx.query);
      next();
    });

    // Create a file
    this.router.post('/', async (ctx, next) => {
      ctx.body = await this.fileService.create(ctx.state, ctx.request.fields);
      next();
    });

    // Read a file
    this.router.get('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.read(ctx.state, ctx.params.id);
      next();
    });

    // Update a file (full update)
    this.router.put('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.update(ctx.state, {
        ...ctx.request.fields,
        id: ctx.params.id,
      });
      next();
    });

    // Patch a file (partial update)
    this.router.patch('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.patch(ctx.state, {
        ...ctx.request.fields,
        id: ctx.params.id,
      });
      next();
    });

    // Delete a file
    this.router.delete('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.read(ctx.state, ctx.params.id);
      next();
    });

    return this.router.routes();
  }
}
