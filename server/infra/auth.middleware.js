import jwt from 'koa-jwt';
import basicAuth from 'koa-basic-auth';
import config from '../common/common.config';

// auth is disabled for these paths
const skipAuthPaths = [
  /^\/infra\/uptimez/,
  /^\/infra\/healthz/,
  /^\/auth\/login/
];

// NOTE: REMOVE THIS IF ONLY BASIC OR JWT AUTH IS REQUIRED
const determineAuthMethod = ctx => {
  let method = null;
  if (!skipAuthPaths.find(path => path.test(ctx.path))) {
    // Use JWT auth for admin GUI and basic auth for everything else
    method =
      ctx.headers.referer && ctx.headers.referer.indexOf('/admin/') !== -1
        ? 'jwt'
        : 'basic';
  }
  return method;
};

const authMiddleware = app => {
  app.use(async (ctx, next) => {
    ctx.myAppAuthMethod = determineAuthMethod(ctx);
    await next();
  });

  // Basic auth
  app.use(async (ctx, next) => {
    ctx.myAppAuthMethod = determineAuthMethod(ctx);
    if (ctx.myAppAuthMethod === 'basic') {
      await basicAuth({
        name: 'user',
        pass: config.passwords.user
      })(ctx, next);
    } else {
      await next();
    }
  });

  // JWT auth
  app.use(
    jwt({
      secret: config.JWT_SECRET,
      key: 'auth'
      // Optionally get jwt from cookie, eg. for download links
      // cookie: 'server-template'
    }).unless({
      paths: skipAuthPaths,
      custom() {
        return determineAuthMethod(this) !== 'jwt';
      }
    })
  );
};

export default authMiddleware;
