import * as Sentry from '@sentry/node';
import { Boom } from '@hapi/boom';
import { Context } from 'koa';

const unexpectedErrorMessage = 'Unexpected error while handling request';

const getErrorBody = (status: any, message: any) => {
  return {
    error: {
      message: status < 500 ? message : unexpectedErrorMessage,
    },
  };
};

export default async function errorHandlerMiddleware(
  ctx: Context,
  next: () => Promise<void>
) {
  try {
    await next();

    // Error without body, add default body through boom error
    if (ctx.response.status >= 400 && !ctx.response.body) {
      throw new Boom(ctx.response.message, { statusCode: ctx.response.status });
    }
  } catch (err: any) {
    if (err.expose) {
      // Koa ctx.throw
      ctx.response.status = err.status;
      ctx.response.body = getErrorBody(ctx.response.status, err.message);
      return;
    }

    if (err.isBoom) {
      // Boom errors are controlled errors
      ctx.response.status = err.output.statusCode;
      ctx.response.body = getErrorBody(ctx.response.status, err.output.payload);
      ctx.response.set(err.output.headers);
      return;
    }

    if (err.isJoi) {
      // Joi errors are controlled errors
      ctx.response.status = err.status;
      ctx.response.body = getErrorBody(ctx.response.status, err.message);
      return;
    }

    // Uncontrolled (unexpected) error stack trace is logged and
    // they are sent to Sentry if enabled
    ctx.response.status = 500;
    ctx.response.body = getErrorBody(500, err.message);
    ctx.state.log.error({ err }, 'Unexpected error while handling request');
    Sentry.captureException(err);
  }
}
