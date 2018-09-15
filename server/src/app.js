import Koa from 'koa';
import koaRouter from 'koa-router';
import Boom from 'boom';

import { log } from './common/log.util';
import config from './common/config';
import routes from './routes';

import {
  loggerMiddleware,
  latencyLoggerMiddleware,
  errorLoggerMiddleware,
} from './infra/logger.middleware';
import transactionMiddleware from './infra/transaction.middleware';
import requestMiddleware from './infra/request.middleware';
import authMiddleware from './infra/auth.middleware';
import exceptionMiddleware from './infra/exception.middleware';
import setupSentry from './infra/sentry.setup';

// Init app
const app = new Koa();
setupSentry();

// Middlewares
requestMiddleware(app);
app.use(loggerMiddleware);
app.use(latencyLoggerMiddleware);
app.use(authMiddleware);
app.use(exceptionMiddleware);
app.use(transactionMiddleware);

// Routes
const router = koaRouter();
routes(router); // Inject router to all routes
app.use(router.routes());
app.use(
  router.allowedMethods({
    throw: true,
    notImplemented: () => Boom.notImplemented(),
    methodNotAllowed: () => Boom.methodNotAllowed(),
  })
);

// More middlewares
errorLoggerMiddleware(app);

// Start the server.
app.listen(config.API_PORT, config.API_BINDADDR, () =>
  log.info(
    { addr: config.API_BINDADDR, port: config.API_PORT },
    `${config.APP_NAME} started`
  )
);

export default app;
