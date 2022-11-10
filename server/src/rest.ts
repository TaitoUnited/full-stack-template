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

const routers = [postRouter, infraRouter];

// add routers one by one to openApi -spec-generator
for (const router of routers) {
  openApi.addRouter(router);
}

const apiDocRouter = openApi.createRouter('/docs');

const restMiddlewares = [postRouter.middleware(), infraRouter.middleware()];

if (config.COMMON_ENV === 'local') {
  restMiddlewares.push(apiDocRouter.middleware());
}

export default restMiddlewares;
