import { Context } from 'koa';
import router from 'koa-joi-router';
import { Container } from 'typedi';

import config from './common/setup/config';
import createApiDocumentation from './infra/middlewares/createApiDocumentation';
import InfraRouter from './infra/routers/InfraRouter';
import { PostRouter } from './core/routers/PostRouter';

// REST API routers
const postRouter = Container.get(PostRouter);
const infraRouter = Container.get(InfraRouter);
const apiDocRouter = router();

apiDocRouter.route({
  method: 'get',
  path: '/docs',
  handler: async (ctx: Context) => {
    ctx.response.body = createApiDocumentation({
      title: config.APP_NAME,
      groups: [postRouter, infraRouter].map((r) => ({
        name: r.group,
        routes: r.routes,
        prefix: r.prefix,
      })),
    });
  },
});

const restMiddlewares = [postRouter.middleware(), infraRouter.middleware()];

if (config.COMMON_ENV === 'local') {
  restMiddlewares.push(apiDocRouter.middleware());
}

export default restMiddlewares;
