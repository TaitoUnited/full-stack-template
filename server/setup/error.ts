import * as Sentry from '@sentry/node';

import { type ServerInstance } from './server';
import { ApiRouteErrorBase } from '~/src/utils/error';

export function setupErrorHandler(server: ServerInstance) {
  server.setErrorHandler((error, request, reply) => {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error));

    request.ctx.log.error(
      { err: normalizedError },
      `Unexpected error while handling request: ${request.method} ${request.url}`
    );

    Sentry.captureException(normalizedError, {
      tags: { requestId: request.ctx.requestId },
    });

    if (
      normalizedError instanceof ApiRouteErrorBase &&
      normalizedError.name === 'ApiRouteError'
    ) {
      const data = {
        requestId: request.ctx.requestId,
        status: normalizedError.status,
        message: normalizedError.message,
        data: normalizedError.data,
      };

      reply.status(data.status).send(data);
      return;
    }

    const errorStatusCode =
      'statusCode' in normalizedError &&
      typeof normalizedError.statusCode === 'number'
        ? normalizedError.statusCode
        : 500;

    const statusCode = errorStatusCode < 500 ? errorStatusCode : 500;
    const message =
      statusCode < 500 ? normalizedError.message : 'Internal server error';

    request.ctx.error = normalizedError;

    reply.status(statusCode).send({
      requestId: request.ctx.requestId,
      status: statusCode,
      message,
    });
  });
}
