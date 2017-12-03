import uuid from 'uuid';
import { log, namespace } from '../common/log.util';

export const setupLoggerMiddleware = async (ctx, next) => {
  // Wrap request in CLS for logging context etc.
  const context = namespace.createContext();

  namespace.enter(context);

  // Figure out request-id.
  const headers = ctx.request.headers;
  let reqId;

  if (headers['request-id']) {
    reqId = headers['request-id'];
  } else if (headers['x-request-id']) {
    reqId = headers['x-request-id'];
  } else {
    reqId = uuid.v4(); // No request ID found in headers, so generate our own.
  }

  namespace.set('reqId', reqId);
  namespace.set('req', ctx.request);
  namespace.set('logCtx', {});

  await next();

  namespace.exit(context);
};

export const loggerMiddleware = async (ctx, next) => {
  // Time how long request handling takes.
  const start = new Date();
  await next();
  const ms = new Date() - start;

  // Log that the request was handled.
  log.info({ res: ctx.res, latency: ms }, `Response: ${ctx.method} ${ctx.url}`);
};

export const logTODO = app => {
  app.on('error', (err, ctx) => {
    // TODO why bunyan logs the error twice?
    log.error(
      { err, req: ctx.req, res: ctx.res },
      'Caught unhandled exception.'
    );
  });
};
