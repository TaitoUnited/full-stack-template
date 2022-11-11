import path from 'path';
import { OpenAPIV3_1 as OpenAPI } from 'openapi-types';
import router from 'koa-joi-router';
import {
  generateParameters,
  generateResponses,
  generateRequestBody,
  resolvePath,
} from './generators';
import BaseRouter from '../../../common/setup/BaseRouter';
import { generateSwaggerHtml } from './swagger';
import config from '../../../common/setup/config';

export type BaseSpec = Partial<OpenAPI.Document> &
  Pick<OpenAPI.Document, 'info'>;

export default class OpenApi {
  routers: BaseRouter[] = [];

  constructor(public readonly baseSpec: BaseSpec) {}

  addRouter(router: BaseRouter) {
    this.routers.push(router);
  }

  generate(spec?: Partial<OpenAPI.Document>): OpenAPI.Document {
    const paths = this.routers.reduce(
      (obj, router) => ({
        ...obj,
        ...this.generateSpec(router),
      }),
      {} as Record<string, OpenAPI.PathItemObject>
    );

    return {
      ...this.baseSpec,
      ...spec,
      openapi: '3.0.0',
      paths,
    };
  }

  createRouter(prefix?: string, swaggerEnabled = false) {
    const docRouter = router();

    if (prefix) {
      docRouter.prefix(prefix);
    }

    docRouter.get(`/_api.json`, (ctx) => {
      ctx.response.body = this.generate();
    });

    if (swaggerEnabled) {
      docRouter.get('/', (ctx) => {
        ctx.response.body = generateSwaggerHtml(
          path.join(config.BASE_PATH, prefix ?? '/', '_api.json')
        );
      });
    }

    return docRouter;
  }

  private generateSpec(router: BaseRouter) {
    const paths: Record<string, OpenAPI.PathItemObject> = {};

    for (const route of router.routes) {
      const pathName = resolvePath(
        path.join(router.prefix, route.path.toString())
      );

      const methods = Array.isArray(route.method)
        ? route.method
        : [route.method];

      const responses = generateResponses(route);
      const parameters = generateParameters(route);
      const requestBody = generateRequestBody(route);

      const spec: OpenAPI.OperationObject = {
        description: route.documentation?.description ?? route.path.toString(),
        responses: {
          ...responses,
        },
        requestBody,
        parameters,
      };

      paths[pathName] = {
        ...paths[pathName],
        ...methods.reduce(
          (obj, method) => ({
            ...obj,
            [method]: spec,
          }),
          {} as Record<string, OpenAPI.OperationObject>
        ),
      };
    }

    return paths;
  }
}
