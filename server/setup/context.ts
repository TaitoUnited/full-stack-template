import type Bunyan from 'bunyan';
import { fastifyPlugin } from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

import { DrizzleDb, getDb } from '~/db';
import { Authenticator, getAuth, Session } from '~/src/utils/authentication';
import { Role } from '~/src/utils/authorisation';
import { log } from '~/src/utils/log';
import { getStringHeader } from '~/src/utils/request';
import { AuthenticatedGraphQLContext } from './graphql/types';
import { AuthenticatedRestContext } from './rest/types';
import { type ServerInstance } from './server';

export type Initiator = 'graphql' | 'rest' | 'test' | 'seed' | 'unknown';

export type Context = {
  log: Bunyan;
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
  server.addHook('onRequest', async (request) => {
    request.ctx = request.ctx || {};
    request.ctx.log = log;
    const db = await getDb();
    request.ctx.db = db;
    request.ctx.auth = getAuth(db);
    request.ctx.requestId = uuidv4();
    request.ctx.organisationId = getStringHeader(request, 'x-organisation-id');
    request.ctx.initiator = 'rest';

    // These will be populated by the auth plugin
    request.ctx.user = null;
    request.ctx.userOrganisations = [];
  });
});
