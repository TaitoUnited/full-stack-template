import * as Sentry from '@sentry/node';

import { type ServerInstance } from './server';

type ErrorData = {
  status: number;
  message: string | Record<string, any>;
};

export class ApiError extends Error {
  data: ErrorData;

  constructor(data: ErrorData) {
    super();
    this.name = 'ApiError';
    this.data = data;
  }
}

export function setupErrorHandler(server: ServerInstance) {
  server.setErrorHandler(function (error, request, reply) {
    request.ctx.log.error(
      { error: { ...error, requestId: request.ctx.requestId } },
      `Unexpected error while handling request: ${error.message}`
    );

    Sentry.captureException(error);

    // TODO: handle GraphQL errors as well
    if (error instanceof ApiError) {
      const data = {
        requestId: request.ctx.requestId,
        status: error.data.status ?? 500,
        message: error.data.message ?? 'Internal Server Error',
      };

      reply.status(data.status).send(data);
      return;
    }

    reply.status(error.statusCode ?? 500).send({
      requestId: request.ctx.requestId,
      status: error.statusCode ?? 500,
      message: error.message ?? 'Internal Server Error',
    });
  });
}
