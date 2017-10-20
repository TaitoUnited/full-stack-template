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

    return { error };
  }
};

export default exceptionMiddleware;
