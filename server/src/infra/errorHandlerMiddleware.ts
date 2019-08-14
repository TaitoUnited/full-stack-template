import * as Sentry from '@sentry/node';
import Boom from 'boom';
import { ParameterizedContext } from 'koa';

export default async function errorHandlerMiddleware(
  ctx: ParameterizedContext,
  next: () => Promise<void>
) {
  try {
    await next();

    // Error without body, add default body through boom error
    if (ctx.response.status >= 400 && !ctx.response.body) {
      throw new Boom(ctx.response.message, { statusCode: ctx.response.status });
    }
  } catch (err) {
    if (err.expose) {
      // Koa ctx.throw
      ctx.response.status = err.status;
      ctx.response.body = {
        error: {
          message: err.message,
        },
      };
      return;
    }

    if (err.isBoom) {
      // Boom errors are controlled errors
      ctx.response.status = err.output.statusCode;
      ctx.response.body = {
        error: err.output.payload,
      };
      ctx.response.set(err.output.headers);
      return;
    }

    if (err.isJoi) {
      // Joi errors are controlled errors
      ctx.response.status = err.status;
      ctx.response.body = { error: { message: err.message } };
      return;
    }

    // Uncontrolled (unexpected) error stack trace is logged and
    // they are sent to Sentry if enabled
    ctx.response.status = 500;
    ctx.response.body = { error: { message: err.message } };
    ctx.log.error({ err }, 'Unexpected error while handling request');
    Sentry.captureException(err);
  }
}
