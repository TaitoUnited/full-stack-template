import koaRouter from 'koa-router';

export default class BaseRoute {
  constructor(router, path) {
    this.router = router || koaRouter();
    this.path = path;
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
