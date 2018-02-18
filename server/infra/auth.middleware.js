import jwt from 'koa-jwt';
import basicAuth from 'koa-basic-auth';
import config from '../common/common.config';

// auth is disabled for these paths
const skipAuthPaths = [
  /^\/infra\/uptimez/,
  /^\/infra\/healthz/,
  /^\/files/,
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
    ctx.clientAuthMethod = determineAuthMethod(ctx);
    await next();
  });

  // Basic auth
  app.use(async (ctx, next) => {
    if (ctx.clientAuthMethod === 'basic') {
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

  // Determine user role
  // NOTE: The example supports two hardcoded users ('admin' and 'user')
  // and their username as used also as role name
  app.use(async (ctx, next) => {
    const rolesByAuth = {
      basic: 'user',
      jwt: ctx.state.jwtdata ? ctx.state.jwtdata.sub : null
    };
    ctx.state.role = rolesByAuth[ctx.state.clientAuthMethod];
    await next();
  });
};

export default authMiddleware;
