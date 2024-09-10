import { BaseSpec } from './infra/middlewares/openapi/OpenApi';

export const openApiSpec: BaseSpec = {
  info: {
    title: 'Taito Full Stack Template REST API',
    description: `
      This documentation is automatically generated with Swagger (OpenAPI)
    `,
    version: '1.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  components: {
    /*
      Different authentication schemas supported by the API can be changed here

      More information: https://swagger.io/docs/specification/authentication/
    */
    securitySchemes: {
      /*
      basicAuth: {
        type: 'http',
        scheme: 'basic'
      },
      */
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [],
};
