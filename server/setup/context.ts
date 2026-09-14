import { drizzle } from 'drizzle-orm/node-postgres';
import type { FastifyBaseLogger } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import type { DrizzleDb } from '~/db';
import { closeDbPool, getDbPool } from '~/db/pool';
import type { Authenticator, Session } from '~/src/utils/authentication';
import { getAuth } from '~/src/utils/authentication';
import type { AuthenticatedGraphQLContext } from './graphql/types';
import type { AuthenticatedRestContext } from './rest/types';
import { type ServerInstance } from './server';

export type Initiator = 'graphql' | 'rest' | 'test' | 'seed' | 'unknown';

export type Context = {
  log: FastifyBaseLogger;
  db: DrizzleDb;
  auth: Authenticator;
  requestId: string;
  initiator: Initiator; // for operation logging and error throwing
  __authenticator__: string | null;
  error: Error | null;

  // Populated in authPlugin, after authentication
  user: null | { id: string; session?: Session };
};

/** Context that has been authenticated (includes user and session), regardless of origin. */
export type AuthenticatedContext =
  | AuthenticatedRestContext
  | AuthenticatedGraphQLContext;

export const contextPlugin = fastifyPlugin(async (server: ServerInstance) => {
  const pool = await getDbPool();
  const db = drizzle(pool);

  server.addHook('onRequest', async (request, reply) => {
    reply.header('X-Request-Id', request.id);

    request.ctx = {
      log: request.log.child({ requestId: request.id }),
      db,
      auth: getAuth(db),
      requestId: request.id,
      initiator: 'rest',
      __authenticator__: null,
      error: null,
      user: null,
    };
  });

  server.addHook('onClose', closeDbPool);
});
