import fastifyPlugin from 'fastify-plugin';
import pino, { type LoggerOptions } from 'pino';

import { config } from '~/src/utils/config';

import { createGcpLoggingConfig } from './log-gcp';
import type { ServerInstance } from './server';
import { isRecord } from '~/src/utils/record';

const isLocalDevelopment =
  config.COMMON_ENV === 'local' && config.NODE_ENV === 'development';

const allowedRequestHeaders = [
  'referer',
  'user-agent',
  'x-forwarded-for',
  'x-real-ip',
  'x-request-id',
];

function getLogConfig(): LoggerOptions {
  const options: LoggerOptions = {
    name: config.APP_NAME,
    level: config.COMMON_LOG_LEVEL ?? 'info',
    serializers: {
      err: pino.stdSerializers.err,
    },
    formatters: {
      bindings: (bindings) => ({
        ...bindings,
        labels: {
          application: config.COMMON_APPLICATION,
          company: config.COMMON_COMPANY,
          domain: config.COMMON_DOMAIN,
          env: config.COMMON_ENV,
          family: config.COMMON_FAMILY,
          imageTag: config.COMMON_IMAGE_TAG,
          project: config.COMMON_PROJECT,
          suffix: config.COMMON_SUFFIX,
        },
      }),
    },
    transport: isLocalDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname,name,labels',
            messageFormat: '{msg} {if requestId}[id:{requestId}]{end}',
            translateTime: 'HH:MM:ss',
          },
        }
      : undefined,
  };

  return isLocalDevelopment ? options : createGcpLoggingConfig(options);
}

export const log = pino(getLogConfig());

export const requestLoggerPlugin = fastifyPlugin((server: ServerInstance) => {
  server.addHook('onRequest', (request, _reply, done) => {
    const message = `Request received ${request.method} ${request.url}`;

    if (isLocalDevelopment) {
      request.ctx.log.info(message);
      done();
      return;
    }

    const headers = Object.fromEntries(
      allowedRequestHeaders.flatMap((header) => {
        const value = request.headers[header];
        return value === undefined ? [] : [[header, value]];
      })
    );

    request.ctx.log.info(
      { headers, method: request.method, url: request.url },
      message
    );

    done();
  });

  server.addHook('onResponse', (request, reply, done) => {
    const requestBody = request.body;
    const graphqlRequestBody = isRecord(requestBody) ? requestBody : undefined;
    const operationName = graphqlRequestBody?.operationName;

    const graphqlOperation =
      typeof operationName === 'string' ? operationName : undefined;

    request.ctx.log.info(
      {
        graphqlOperation,
        responseTime: Math.round(reply.elapsedTime * 100) / 100,
        statusCode: reply.statusCode,
      },
      `Request completed ${request.method} ${request.url}`
    );

    done();
  });
});
