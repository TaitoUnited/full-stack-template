import { drizzle } from 'drizzle-orm/node-postgres';
import type { FastifyBaseLogger } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import type { DrizzleDb } from '~/db';
import { closeDbPool, getDbPool } from '~/db/pool';
import type { Authenticator, Session } from '~/src/utils/authentication';
import { getAuth } from '~/src/utils/authentication';
import type { Role } from '~/src/utils/authorisation';
import { getStringHeader } from '~/src/utils/request';
import type { AuthenticatedGraphQLContext } from './graphql/types';
import type { AuthenticatedRestContext } from './rest/types';
import { type ServerInstance } from './server';

export type Initiator = 'graphql' | 'rest' | 'test' | 'seed' | 'unknown';

export type Context = {
  log: FastifyBaseLogger;
  db: DrizzleDb;
  auth: Authenticator;
  requestId: string;
  organisationId: null | string; // from request header 'x-organisation-id'
  initiator: Initiator; // for operation logging and error throwing
  __authenticator__: string | null;
  error: Error | null;

  // Populated in authPlugin, after authentication
  user: null | { id: string; session?: Session };
  userOrganisations: { id: string; role: Role }[];
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
      organisationId: getStringHeader(request, 'x-organisation-id'),
      initiator: 'rest',
      __authenticator__: null,
      error: null,
      user: null,
      userOrganisations: [],
    };
  });

  server.addHook('onClose', closeDbPool);
});
