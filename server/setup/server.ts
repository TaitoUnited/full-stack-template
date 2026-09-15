import crypto from 'node:crypto';

import {
  TypeBoxValidatorCompiler,
  type TypeBoxTypeProvider,
} from '@fastify/type-provider-typebox';
import Fastify, { LogController } from 'fastify';
import queryString from 'query-string';

import { config } from '~/src/utils/config';

import { log } from './log';

/**
 * Fastify server instance.
 * Note: keep this in separate file to avoid circular imports/dependencies.
 */
export const server = Fastify({
  // Close connections on server shutdown
  forceCloseConnections: true,
  routerOptions: {
    // Custom parser for query strings to be able to use booleans and numbers.
    querystringParser: (str) => {
      return queryString.parse(str, {
        parseBooleans: true,
        parseNumbers: true,
        arrayFormat: 'comma',
      });
    },
  },
  // Keep Node's timeout above the reverse proxy timeout to avoid spurious 502s.
  keepAliveTimeout: 70_000,
  loggerInstance: log,
  logController: new LogController({
    disableRequestLogging: true,
    requestIdLogLabel: 'requestId',
  }),
  genReqId: (request) => {
    const requestIdHeader = request.headers['x-request-id'];

    const upstreamRequestId = Array.isArray(requestIdHeader)
      ? requestIdHeader[0]
      : requestIdHeader;

    const requestId = upstreamRequestId
      ? `upstream:${upstreamRequestId}`
      : `internal:${crypto.randomUUID()}`;

    return config.COMMON_ENV === 'local'
      ? requestId.split(':').at(-1)!.substring(0, 6)
      : requestId;
  },
})
  .withTypeProvider<TypeBoxTypeProvider>()
  .setValidatorCompiler(TypeBoxValidatorCompiler);

export type ServerInstance = typeof server;
