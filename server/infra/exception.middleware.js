import { log } from '../common/log.util';
import config from '../common/common.config';

const exceptionMiddleware = async (ctx, next) => {
  // Wraps request handling in the try block.
  try {
    const res = await next();
    return res || {};
  } catch (err) {
    if (config.DEBUG) log.error(err);

    const error = {};

    if (err.status === 401 && ctx.myAppAuthMethod === 'basic') {
      // Ask client to use basic auth
      ctx.set('WWW-Authenticate', 'Basic');
    }

    if (err.isBoom) {
      // Handle Boom errors
      error.status = err.output.statusCode;
      error.message = err.output.payload.message;
    } else if (err.status) {
      // Handle middleware errors thrown with ctx.throw
      error.status = err.status;
      error.message = err.message;
    } else {
      error.status = 500;
      // Return more understandable message in dev environment
      error.message = config.DEBUG ? err.toString() : 'Unknown error';
    }

    ctx.status = error.status;
    ctx.body = { error };
    ctx.app.emit('error', new Error(error.message), ctx);
    return {};
  }
};

export default exceptionMiddleware;
