import { ParameterizedContext } from "koa";
import router from "koa-joi-router";

import config from "./common/config";
import createApiDocumentation from "./infra/createApiDocumentation";
import InfraRouter from "./infra/InfraRouter";
import { PostRouter } from "./blog/PostRouter";

const postRouter = new PostRouter();
const infraRouter = new InfraRouter();
const apiDocRouter = router();

apiDocRouter.route({
  method: "get",
  path: "/docs",
  handler: async (ctx: ParameterizedContext) => {
    ctx.response.body = createApiDocumentation({
      title: config.APP_NAME,
      groups: [postRouter, infraRouter].map(r => ({
        name: r.group,
        routes: r.routes,
        prefix: r.prefix
      }))
    });
  }
});

const routerMiddlewares = [
  postRouter.middleware(),
  infraRouter.middleware(),
  apiDocRouter.middleware()
];

export default routerMiddlewares;
