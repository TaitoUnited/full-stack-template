import * as Sentry from '@sentry/node';

import { type ServerInstance } from './server';
import { ApiRouteErrorBase } from '~/utils/error';

export function setupErrorHandler(server: ServerInstance) {
  server.setErrorHandler(function (error, request, reply) {
    request.ctx.log.error(
      { error: { ...error, requestId: request.ctx.requestId } },
      `Unexpected error while handling request: ${error.message}`
    );

    Sentry.captureException(error);

    if (error instanceof ApiRouteErrorBase && error.name === 'ApiRouteError') {
      const data = {
        requestId: request.ctx.requestId,
        status: error.status ?? 500,
        message: error.message ?? 'Internal Server Error',
        data: error.data,
      };

      reply.status(data.status).send(data);
      return;
    }

    // TODO: do we need to handle GraphQL errors here?

    reply.status(error.statusCode ?? 500).send({
      requestId: request.ctx.requestId,
      status: error.statusCode ?? 500,
      message: error.message ?? 'Internal Server Error',
    });
  });
}
