import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import queryString from 'query-string';

/**
 * Fastify server instance.
 * Note: keep this in separate file to avoid circular imports/dependencies.
 */
export const server = Fastify({
  // Custom parser for query strings to be able to use booleans and numbers
  querystringParser: (str) => {
    return queryString.parse(str, {
      parseBooleans: true,
      parseNumbers: true,
    });
  },
}).withTypeProvider<TypeBoxTypeProvider>();

export type ServerInstance = typeof server;
