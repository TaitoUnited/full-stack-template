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
      ctx.body = await this.fileService.fetch(
        ctx.myappCtx, ctx.params);
      next();
    });

    // Create a file
    this.router.post('/', async (ctx, next) => {
      // TODO quick temp hack
      ctx.body = await this.fileService.create(
        ctx.myappCtx, ctx.request.fields);
      next();
    });

    // Read a file
    this.router.get('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.read(
        ctx.myappCtx, ctx.params.id);
      next();
    });

    // Update a file (full update)
    this.router.put('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.update(
        ctx.myappCtx, ctx.request.fields);
      next();
    });

    // Patch a file (partial update)
    this.router.patch('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.patch(
        ctx.myappCtx, ctx.request.fields);
      next();
    });

    // Delete a file
    this.router.delete('/:id', async (ctx, next) => {
      ctx.body = await this.fileService.read(
        ctx.myappCtx, ctx.params.id);
      next();
    });

    return this.router.routes();
  }

}
