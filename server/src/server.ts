import 'reflect-metadata';
import serverless from 'serverless-http';
import Koa from 'koa';
import patchKoaQs from 'koa-qs';
import config from './common/config';
import getDb from './common/db';
import log from './common/log';
import dbTransactionMiddleware from './infra/dbTransactionMiddleware';
import errorHandlerMiddleware from './infra/errorHandlerMiddleware';
import initSentry from './infra/initSentry';
import requestLoggerMiddleware from './infra/requestLoggerMiddleware';
import restMiddlewares from './rest';
import apollo from './graphql';

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
restMiddlewares.forEach((middleware) => {
  server.use(middleware);
});

// GraphQL API routing
apollo.applyMiddleware({ app: server, path: '/' });

// Start the server or function handler
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
