import { Container } from 'typedi';

import config from './common/setup/config';
import InfraRouter from './infra/routers/InfraRouter';
import { PostRouter } from './core/routers/PostRouter';
import { OpenApi } from './infra/middlewares/openapi';
import { openApiSpec } from './docs';

// REST API routers
const postRouter = Container.get(PostRouter);
const infraRouter = Container.get(InfraRouter);

const openApi = new OpenApi(openApiSpec);

// these routers will have openApi -compatible documentation generated
const documentedRouters = [postRouter, infraRouter];

// add routers one by one to openApi -spec-generator
for (const router of documentedRouters) {
  openApi.addRouter(router);
}

const restMiddlewares = [postRouter, infraRouter].map((router) =>
  router.middleware()
);

if (config.API_DOCS_ENABLED || config.API_PLAYGROUND_ENABLED) {
  const apiDocRouter = openApi.createRouter(
    '/docs',
    config.API_PLAYGROUND_ENABLED
  );

  restMiddlewares.push(apiDocRouter.middleware());
}

export default restMiddlewares;
