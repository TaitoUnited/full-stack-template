import 'reflect-metadata';
import bodyParser from 'koa-bodyparser';
import { koaMiddleware } from '@as-integrations/koa';
import patchKoaQs from 'koa-qs';
import jwt from 'koa-jwt';

import config, { getSecrets } from './common/setup/config';
import getDb from './common/setup/db';
import log from './common/setup/log';
import restMiddlewares from './rest';
import apollo from './graphql';
import { initFunctionHandler } from './function';
import { httpServer, server } from './http';
import initSentry from './infra/middlewares/initSentry';
import requestLoggerMiddleware from './infra/middlewares/requestLoggerMiddleware';
import errorHandlerMiddleware from './infra/middlewares/errorHandlerMiddleware';
import dbTransactionMiddleware from './infra/middlewares/dbTransactionMiddleware';

// Sentry
initSentry();

// Start the server or function handler
let handler = null;

async function setupServer() {
  patchKoaQs(server); // Adds support for query parameter nesting

  const secrets = await getSecrets();

  // Request state prototype
  server.use(async (ctx, next) => {
    ctx.state = ctx.state || {};
    ctx.state.log = log;
    ctx.state._db = await getDb();
    ctx.state.locale =
      ctx.acceptsLanguages('fi', 'en') || config.DEFAULT_LOCALE;
    ctx.state.dbDuration = 0;
    await next();
  });

  // Middlewares
  server.use(requestLoggerMiddleware); // Assume no errors in logging
  server.use(errorHandlerMiddleware);
  server.use(bodyParser()); // Required by dbTransactionMiddleware.isGraphQLQuery
  server.use(dbTransactionMiddleware);
  server.use(
    jwt({
      secret: secrets.SESSION_SECRET,
      passthrough: true,
      key: 'user',
      cookie: 'session',
    })
  );
  // When you create an auth middleware, you need to add it here
  // server.use(authMiddleware);

  // REST API routing
  restMiddlewares.forEach((middleware) => {
    server.use(middleware);
  });

  await apollo.start();

  // GraphQL API routing
  server.use(
    koaMiddleware(apollo, {
      context: async ({ ctx }) => ctx,
    })
  );

  if (config.RUN_AS_FUNCTION) {
    handler = initFunctionHandler(server, config.BASE_PATH);
    log.info('Function started');
  } else {
    httpServer.listen(config.API_PORT, config.API_BINDADDR, () => {
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
}

setupServer()
  .then(() => {
    log.info('Server setup complete');
  })
  .catch((err) => {
    log.error(err, 'Server setup failed');
  });

export { server, handler };
