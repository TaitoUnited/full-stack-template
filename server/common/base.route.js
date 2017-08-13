import koaRouter from 'koa-router';

export default class BaseRoute {
  constructor() {
    this.router = koaRouter();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }
}
