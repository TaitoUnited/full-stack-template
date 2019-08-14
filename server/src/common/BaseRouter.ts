import router, { ExtendedSpec, FullHandler, Joi } from 'koa-joi-router';
import stackTrace from 'stack-trace';

// Wrapper for koa-joi-router with prefix and group additions
export default class BaseRouter {
  private router = router();

  private prefixLocal = '';

  private groupLocal = '';

  private JoiLocal = Joi;

  constructor(r = null) {
    this.router = r || this.router;
  }

  public middleware() {
    return this.router.middleware();
  }

  public use(...middleware: FullHandler[]) {
    this.router.use(...middleware);
  }

  public route(route: ExtendedSpec) {
    if (route.documentation) {
      const caller = stackTrace.get()[1];
      const callerString = `${caller.getFileName()}:${caller.getFunctionName()}:${caller.getLineNumber()}`;
      route.documentation.caller = callerString;
    }
    this.router.route(route);
  }

  public get routes() {
    return this.router.routes;
  }

  public set prefix(prefix: string) {
    this.prefixLocal = prefix;
    this.router.prefix(this.prefixLocal);
  }

  public get prefix() {
    return this.prefixLocal;
  }

  public set group(group: string) {
    this.groupLocal = group;
  }

  public get group() {
    return this.groupLocal;
  }

  public get Joi() {
    return this.JoiLocal;
  }
}
