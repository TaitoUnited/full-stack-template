import jwt from 'koa-jwt';
import config from '../common/app.config';

const authMiddleware = jwt({
  secret: config.JWT_SECRET,
  key: 'auth',
  // Optionally get jwt from cookie, eg. pdf download
  cookie: 'auron-exlib-secret',
}).unless({
  path: [
    /^\/.*/,  // NOTE: Remove to enable auth
    /^\/infra/,
    /^\/auth\/login/,
  ],
});

export default authMiddleware;
