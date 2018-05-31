import BaseRoute from '../common/base.route';
import createAuthService from './auth.service';

export default class AuthRoute extends BaseRoute {
  constructor(router, authService) {
    super(router, '/auth');
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.authService = authService || createAuthService();
  }

  routes() {
    this.router.post('/login', async (ctx, next) => {
      const credentials = ctx.request.body;
      const userData = await this.authService.authenticate(credentials);
      ctx.body = {
        data: userData,
      };
      next();
    });

    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
