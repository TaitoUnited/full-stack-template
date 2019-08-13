// Original from
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/koa-joi-router/index.d.ts
// Fixed Specs + added Documentation

// Type definitions for koa-joi-router 5.1
// Project: https://github.com/koajs/joi-router
// Definitions by: Matthew Bull <https://github.com/wingsbob>
//                 Dave Welsh <https://github.com/move-zig>
//                 Hiroshi Ioka <https://github.com/hirochachacha>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

declare module 'koa-joi-router' {
  import RealJoi from 'joi';
  import Koa from 'koa';
  import KoaRouter from 'koa-router';

  namespace createRouter {
    const Joi: typeof RealJoi;

    type PartialHandler = (ctx: Koa.ParameterizedContext) => any;
    type FullHandler = (
      ctx: Koa.ParameterizedContext,
      next: () => Promise<any>
    ) => any;
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface NestedHandler
      extends ReadonlyArray<PartialHandler | FullHandler | NestedHandler> {}
    type Handler = PartialHandler | FullHandler | NestedHandler;

    interface Documentation {
      description: string;
      extendedDescription?: string;
      caller?: string;
    }

    interface Spec {
      documentation?: Documentation;
      validate?: {
        header?: RealJoi.AnySchema | { [key: string]: RealJoi.AnySchema };
        query?: RealJoi.AnySchema | { [key: string]: RealJoi.AnySchema };
        params?: RealJoi.AnySchema | { [key: string]: RealJoi.AnySchema };
        body?: RealJoi.AnySchema | { [key: string]: RealJoi.AnySchema };
        maxBody?: number;
        failure?: number;
        type?: 'form' | 'json' | 'multipart';
        output?: {
          [statusRange: string]: {
            body?: RealJoi.AnySchema | { [key: string]: RealJoi.AnySchema };
            headers?: RealJoi.AnySchema | { [key: string]: RealJoi.AnySchema };
          };
        };
        continueOnError?: boolean;
      };
    }

    interface ExtendedSpec extends Spec {
      handler: Handler;
      method: string | string[];
      path: string | RegExp;
    }

    interface Method {
      (path: string | RegExp, handler: Handler): Router;
      (
        path: string | RegExp,
        middleware: Koa.Middleware,
        handler: Handler
      ): Router;
      (path: string | RegExp, config: Spec, handler: Handler): Router;
      (
        path: string | RegExp,
        config: Spec,
        middleware: Koa.Middleware,
        handler: Handler
      ): Router;
    }

    interface Router {
      routes: Spec[];
      route(spec: ExtendedSpec | ExtendedSpec[]): Router;
      middleware(): Koa.Middleware;

      prefix: KoaRouter['prefix'];
      use: KoaRouter['use'];
      param: KoaRouter['param'];

      head: Method;
      options: Method;
      get: Method;
      post: Method;
      put: Method;
      patch: Method;
      delete: Method;
    }
  }

  type Router = createRouter.Router;

  function createRouter(): Router;

  export = createRouter;
}
