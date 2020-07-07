import serverless from 'serverless-http';
import Koa from 'koa';
import patchKoaQs from 'koa-qs';
import config from './common/config';
import db from './common/db';
import log from './common/log';
import dbTransactionMiddleware from './infra/dbTransactionMiddleware';
import errorHandlerMiddleware from './infra/errorHandlerMiddleware';
import initSentry from './infra/initSentry';
import requestLoggerMiddleware from './infra/requestLoggerMiddleware';
import routerMiddlewares from './routerMiddlewares';

initSentry();

const server = new Koa();
// Add support for query parameter nesting
patchKoaQs(server);

// Request state prototype
server.use(async (ctx, next) => {
  ctx.state = ctx.state || {};
  ctx.state.log = log;
  ctx.state.db = db;
  await next();
});

// Middlewares
server.use(requestLoggerMiddleware); // Assume no errors in logging
server.use(errorHandlerMiddleware);
server.use(dbTransactionMiddleware);
routerMiddlewares.forEach((middleware) => {
  server.use(middleware);
});

let handler = null;
handler = serverless(server, { basePath: process.env.API_URL });
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
}

export { server, handler };
