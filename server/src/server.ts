import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import patchKoaQs from 'koa-qs';
import config from './common/setup/config';
import getDb from './common/setup/db';
import log from './common/setup/log';
import dbTransactionMiddleware from './infra/middlewares/dbTransactionMiddleware';
import errorHandlerMiddleware from './infra/middlewares/errorHandlerMiddleware';
import initSentry from './infra/middlewares/initSentry';
import requestLoggerMiddleware from './infra/middlewares/requestLoggerMiddleware';
import restMiddlewares from './rest';
import apollo from './graphql';
import { initFunctionHandler } from './function';

// Sentry
initSentry();

// Koa
const server = new Koa();
patchKoaQs(server); // Adds support for query parameter nesting

// Request state prototype
server.use(async (ctx, next) => {
  ctx.state = ctx.state || {};
  ctx.state.log = log;
  ctx.state._db = await getDb();
  await next();
});

// Middlewares
server.use(requestLoggerMiddleware); // Assume no errors in logging
server.use(errorHandlerMiddleware);
server.use(bodyParser()); // Required by dbTransactionMiddleware.isGraphQLQuery
server.use(dbTransactionMiddleware);

// REST API routing
restMiddlewares.forEach((middleware) => {
  server.use(middleware);
});

// GraphQL API routing
apollo.applyMiddleware({ app: server, path: '/' });

// Start the server or function handler
let handler = null;
if (config.RUN_AS_FUNCTION) {
  handler = initFunctionHandler(server, config.BASE_PATH);
  log.info('Function started');
} else {
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
}

export { server, handler };
