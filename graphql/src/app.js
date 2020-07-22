import Koa from 'koa';
import koaRouter from 'koa-router';
import koaCacheControl from 'koa-cache-control';
import koaProxy from 'koa-proxy';
import routes from './routes';

// Init app
const app = new Koa();

// Disable HTTP-cache
app.use(
  koaCacheControl({
    noCache: true,
  })
);

// Routes
const router = koaRouter();
routes(router); // Inject router to all routes
app.use(router.routes());

// API proxy
app.use(
  koaProxy({
    host: `http://${process.env.API_HOST}:${process.env.API_PORT}`,
    // match: /^(?!\/infra\/)/,
  })
);

// TODO stuff
app.use(
  router.allowedMethods({
    throw: true,
    // notImplemented: () => Boom.notImplemented(),
    // methodNotAllowed: () => Boom.methodNotAllowed(),
  })
);

// Start the server.
app.listen(
  process.env.GRAPHQL_PORT || 4001,
  process.env.GRAPHQL_BINDADDR || '127.0.0.1',
  () => console.log('GraphQL gateway started')
);

export default app;
