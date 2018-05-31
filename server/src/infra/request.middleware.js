// import cors from 'kcors';
import koaCacheControl from 'koa-cache-control';
import koaConvert from 'koa-convert';
import koaBodyParser from 'koa-bodyparser';

const requestMiddleware = app => {
  // Use Cors
  // TODO enable only if origin is in the list of allowed domains (env vars)
  // app.use(cors());

  // Disable HTTP-cache
  app.use(
    koaCacheControl({
      noCache: true,
    })
  );

  // Parse body payloads (json, form data etc)
  app.use(koaConvert(koaBodyParser()));
};

export default requestMiddleware;
