import BaseRoute from '../common/base.route';
import FileService from './file.service';

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
      const data = await this.fileService.fetch(ctx.state, ctx.query);
      ctx.body = data;
      next();
    });

    // Create a file
    this.router.post('/', async (ctx, next) => {
      const data = await this.fileService.create(ctx.state, ctx.request.body);
      ctx.body = { data };
      next();
    });

    // Read a file
    this.router.get('/:id', async (ctx, next) => {
      const data = await this.fileService.read(ctx.state, ctx.params.id);
      ctx.body = { data };
      next();
    });

    // Update a file (full update)
    this.router.put('/:id', async (ctx, next) => {
      const data = await this.fileService.update(ctx.state, {
        ...ctx.request.body,
        id: ctx.params.id,
      });
      ctx.body = { data };
      next();
    });

    // Patch a file (partial update)
    this.router.patch('/:id', async (ctx, next) => {
      const data = await this.fileService.patch(ctx.state, {
        ...ctx.request.body,
        id: ctx.params.id,
      });
      ctx.body = { data };
      next();
    });

    // Delete a file
    this.router.delete('/:id', async (ctx, next) => {
      const data = await this.fileService.read(ctx.state, ctx.params.id);
      ctx.body = { data };
      next();
    });

    return this.router.routes();
  }
}
