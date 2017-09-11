import Koa from 'koa';
import koaRouter from 'koa-router';
import bodyParser from 'koa-better-body';
import koaCacheControl from 'koa-cache-control';
import Boom from 'boom';
import Raven from 'raven';

// NOTE: Enable if cors is required
// import cors from 'kcors';

import { roles } from './examples/common/example.constants';
import config from './config';
import log from './log';
import transactionManager from './db';
import ns from './cls';
import routes from './routes';
import uuid from 'uuid';


/* eslint-disable */
// NOTE: Typical responsibilities for pre- and post-processing a request:
//
// - Request parser: Parse the request using a set of libraries.
// - Logging handler: Logs incoming requests and operation results.
// - Authentication manager: Parse auth tokens and populate context with necessary
//   info like username, user roles, etc.
// - Authentication filter: Allow unauthenticated access only to public
//   resources.
// - Transaction manager: Init database and transactional context that services
//   can use to start/join a transaction, and make sure that transaction is
//   committed on success and rolled back on error. Note that in functional
//   languaes you can easily do the whole transaction management inside a
//   service method and still keep your code DRY.
// - Router: Route the request to a correct service method.
// - Exception handler: Catch exceptions and return appropriate error response:
//     - 400 Bad Request: validation error
//     - 401 Unauthorized: unauthorized user requested a private resource.
//     - 403 Forbidden: user has no rights
//     - 404 Not found: requested resource/object was not found
//     - 409 Conflict: e.g. two users modified the same object simultaneously
//       (optimistic locking: https://blog.couchbase.com/optimistic-or-pessimistic-locking-which-one-should-you-pick/)
//     - ...
//     - 500 Internal Server Error: unexpected technical error
//     - 501 Not Implemented
//     - 503 Service Unavailable
// - Response formatter: Misc response processing like setting up response
//   headers.
//
/* eslint-enable */

// Database


const app = new Koa();

// Sentry

/* eslint-disable */
if (process.env.COMMON_ENV !== 'local') {
  Raven.config(process.env.APP_SENTRY_DSN, {
    release: `${process.env.BUILD_VERSION}+${process.env.BUILD_IMAGE_TAG}`,
    environment: process.env.COMMON_ENV,
  }).install();
}
/* eslint-enable */

// Basic setup

// Parse body
app.use(bodyParser());
// Handle 404 not found with Boom.
app.use(async (ctx, next) => {
  await next();
});

// NOTE: Enable if cors is required
// app.use(cors());

// Disable HTTP-cache
app.use(koaCacheControl({
  noCache: true,
}));


// Authentication manager
app.use(async (ctx, next) => {
  // TODO get from JWT token
  ctx.myappCtx = {};
  ctx.myappCtx.user = {
    username: 'mmeikalai',
    role: roles.dealer,
  };
  await next();
});


// Authentication filter
app.use(async (ctx, next) => {
  if (!ctx.myappCtx.user) {
    throw Boom.unauthorized('Unauthorized');
  }
  await next();
});


// Transaction manager
app.use(transactionManager);


// Logging handler: setup logging context
app
.use(async (ctx, next) => {
  // Wrap request in CLS for logging context etc.
  const context = ns.createContext();
  ns.enter(context);

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

  ns.set('req_id', reqId);
  ns.set('logCtx', {});

  await next();
  ns.exit(context);
})


// Exception handler
.use(async (ctx, next) => {
  // Middleware that catches errors that are propagated all the way to the top.
  try {
    await next(); // Wraps request handling in the try block.
  } catch (err) {
    // Wrap error into a Boom error, if necessary.
    const error = Boom.wrap(err, 500, 'Internal Server Error');
    // Set the error output.
    ctx.status = error.output.statusCode;
    if (error.data && error.data.causes) { // takes filee of c !== null check
      const c = error.data.causes;
      // Would require (c !== null && typeof c..) but it is already checked
      const causes = (typeof c === 'object') ? c
                     : { UNKNOWN_CAUSE: c }; // If you see this, fix your code?
      ctx.body = { ...error.output.payload, causes };
    } else {
      ctx.body = error.output.payload;
    }

    // If this is an internal server error, emit the appropriate event.
    if (error.isServer) ctx.app.emit('error', error, ctx);
  }
})
.use(async (ctx, next) => {
  // Handle 404 not found with Boom.
  await next();
  if (ctx.status !== 404) return;
  throw Boom.notFound('Resource not found.');
})


// Logging handler: log incoming request
.use(async (ctx, next) => {
  // Log incoming request.
  log.info({ req: ctx.req }, `Request: ${ctx.method} ${ctx.url}`);
  // Time how long request handling takes.
  const start = new Date;
  await next();
  const ms = new Date - start;
  // Log that the request was handled.
  log.info({ res: ctx.res, latency: ms }, `Response: ${ctx.method} ${ctx.url}`);
});


// Router
const router = koaRouter();
routes(router);
app
.use(router.routes())
.use(router.allowedMethods({
  throw: true,
  notImplemented: () => Boom.notImplemented(),
  methodNotAllowed: () => Boom.methodNotAllowed(),
}));


// Logging handler: log errors
app.on('error', (err, ctx) => {
  log.error({ err, req: ctx.req, res: ctx.res }, 'Caught unhandled exception.');
});


// Start the server.
app.listen(
  config.API_PORT,
  config.API_BINDADDR,
  () => log.info(
    { addr: config.API_BINDADDR, port: config.API_PORT },
    `${config.APP_NAME} started`
  )
);

export default app;
