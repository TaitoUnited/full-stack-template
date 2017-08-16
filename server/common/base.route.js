import koaRouter from 'koa-router';

export default class BaseRoute {
  constructor(router) {
    this.router = router || koaRouter();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
