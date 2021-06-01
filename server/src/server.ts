import 'reflect-metadata';
import serverless from 'serverless-http';
import Koa from 'koa';
import patchKoaQs from 'koa-qs';
import { buildSchemaSync } from 'type-graphql';
import { ApolloServer } from 'apollo-server-koa';
import { Container } from 'typedi';
import config from './common/config';
import getDb from './common/db';
import log from './common/log';
import authChecker from './common/auth';
import dbTransactionMiddleware from './infra/dbTransactionMiddleware';
import errorHandlerMiddleware from './infra/errorHandlerMiddleware';
import initSentry from './infra/initSentry';
import requestLoggerMiddleware from './infra/requestLoggerMiddleware';
import routerMiddlewares from './routerMiddlewares';

// Sentry
initSentry();

// Koa
const server = new Koa();
patchKoaQs(server); // Adds support for query parameter nesting

// Request state prototype
server.use(async (ctx, next) => {
  ctx.state = ctx.state || {};
  ctx.state.log = log;
  ctx.state.db = await getDb();
  await next();
});

// Middlewares
server.use(requestLoggerMiddleware); // Assume no errors in logging
server.use(errorHandlerMiddleware);
server.use(dbTransactionMiddleware);

// REST API routing
routerMiddlewares.forEach((middleware) => {
  server.use(middleware);
});

// GraphQL schema
const schema = buildSchemaSync({
  resolvers: [`${process.env.PWD}/src/**/*Resolver.{ts,js}`],
  container: Container,
  authChecker: ({ context }, roles) => authChecker(context, roles),
  authMode: 'null',
  validate: true,
  emitSchemaFile: config.COMMON_ENV === 'local' ? 'schema.gql' : false,
});

// GraphQL routing
const apollo = new ApolloServer({
  schema,
  context: ({ ctx, connection }) => {
    if (ctx) {
      return ctx;
    }
    return connection.context;
  },
  introspection: ['local', 'dev', 'test'].includes(config.COMMON_ENV || ''),
  playground: ['local', 'dev', 'test'].includes(config.COMMON_ENV || '')
    ? {
        endpoint: config.BASE_PATH,
        settings: {
          'request.credentials': 'include',
        },
      }
    : false,
  formatError: (err) => {
    log.error(err);

    return {
      ...err,
      code: err.extensions?.code,
      extensions: undefined,
    };
  },
});
apollo.applyMiddleware({ app: server, path: '/' });

// Start server or function handler
let handler = null;
handler = serverless(server, { basePath: config.BASE_PATH });
if (!handler || config.COMMON_ENV === 'local') {
  server.listen(config.API_PORT, config.API_BINDADDR, () => {
    log.info(
      {
        name: config.APP_NAME,
        address: config.API_BINDADDR,
        port: config.API_PORT,
      },
      'Server started'
    );
  });
} else {
  log.info('Function started');
}

export { server, handler };
