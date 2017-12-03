import config from '../common/common.config';

const exceptionMiddleware = async (ctx, next) => {
  // Wraps request handling in the try block.
  try {
    const res = await next();
    return res || {};
  } catch (err) {
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

    // Create response
    ctx.status = error.status;
    ctx.body = { error };
    if (err.status === 401 && ctx.myAppAuthMethod === 'basic') {
      // Ask client to use basic auth
      ctx.set('WWW-Authenticate', 'Basic');
    }

    if (error.status >= 500) {
      // Unexpected error: emit the original error so that it will be logged
      // as error
      ctx.app.emit('error', err, ctx);
    }
    return {};
  }
};

export default exceptionMiddleware;
