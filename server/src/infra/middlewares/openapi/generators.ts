import { OpenAPIV3_1 as OpenAPI } from 'openapi-types';
import j2s from 'joi-to-swagger';
import Joi from 'joi';
import { defaultDescriptions } from './common';
import { RouteSpec } from '../../../common/setup/BaseRouter';

/**
 * Generate a dictionary of status-codes with their responses
 *
 * {
 *  "200": {
 *    "description": "...",
 *    "content": {
 *      ...
 *     }
 *  }
 * }
 */
export function generateResponses(route: RouteSpec) {
  const validate = route.validate ?? {};

  const output = validate.output ?? {};

  const errorSchema = j2s(
    Joi.object({
      error: Joi.object({
        message: Joi.object({
          statusCode: Joi.number().integer(),
          error: Joi.string().required(),
          message: Joi.string(),
        }),
      }),
    })
  ).swagger;

  const defaultResponses: Record<string, OpenAPI.ResponseObject> = {
    '200': {
      description: 'OK',
    },
    '4xx': {
      description: 'Client Error',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },

    '5xx': {
      description: 'Server Error',
      content: {
        'application/json': {
          schema: errorSchema,
        },
      },
    },
  };

  const responses = Object.entries(output).reduce(
    (obj, [status, schema]) => {
      const body: any = 'body' in schema ? schema.body : undefined;

      if (!body) {
        return obj;
      }

      return {
        ...obj,
        [status]: {
          description: defaultDescriptions[status] || status,
          content: {
            'application/json': {
              schema: j2s(body).swagger,
            },
          },
        },
      };
    },
    {} as Record<string, OpenAPI.ResponseObject>
  );

  return { ...defaultResponses, ...responses };
}

export function generateParameters(route: RouteSpec) {
  const validate = route.validate ?? {};

  const query = (validate.query as Record<string, Joi.Schema>) ?? {};
  const params = (validate.params as Record<string, Joi.Schema>) ?? {};

  const parameters: OpenAPI.ParameterObject[] = [];

  // query params, /posts?offset=0
  for (const param in query) {
    const schema = query[param];

    const required = (schema.describe().flags as any)?.presence === 'required';

    parameters.push({
      name: param,
      in: 'query',
      required,
      schema: j2s(schema).swagger,
      description: route.documentation?.query?.[param],
    });
  }

  // url params, i.e. /posts/:id
  for (const param in params) {
    const schema = params[param];

    parameters.push({
      in: 'path',
      name: param,
      required: true,
      schema: j2s(schema).swagger,
    });
  }

  return parameters;
}

/**
 * Resolve Koa/Joi-router compatible path for OpenAPI compliant one
 *
 * /users/:userId -> /users/{userId}
 */
export function resolvePath(path: string) {
  return path.replace(/:([a-zA-Z0-9]*)/, '{$1}');
}

export function generateRequestBody(route: RouteSpec) {
  const validate = route.validate ?? {};

  const body = validate.body;

  if (!body) {
    return undefined;
  }

  return {
    description: route.documentation?.body,
    content: {
      'application/json': {
        schema: j2s(body as any).swagger,
      },
    },
  };
}
