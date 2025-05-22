import type Bunyan from 'bunyan';
import { fastifyPlugin } from 'fastify-plugin';
import { Lucia } from 'lucia';
import { v4 as uuidv4 } from 'uuid';

import { type ServerInstance } from './server';
import type { Session } from '~/src/utils/authentication';
import { log } from '~/src/utils/log';
import { getAuth } from '~/src/utils/authentication';
import { getStringHeader } from '~/src/utils/request';
import { DrizzleDb, getDb } from '~/db';
import { AuthenticatedRestContext } from './rest/types';
import { AuthenticatedGraphQLContext } from './graphql/types';
import { Role } from '~/src/utils/authorisation';

export type OriginApi = 'graphql' | 'rest';
export type Context = {
  log: Bunyan;
  db: DrizzleDb;
  auth: Lucia;
  requestId: string;
  organisationId: null | string; // from request header 'x-organisation-id'
  originApi: OriginApi; // for operation logging and error throwing
  // Populated in authPlugin, after authentication
  user: null | { id: string };
  session: null | Session;
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
    request.ctx.db = await getDb();
    request.ctx.auth = await getAuth();
    request.ctx.requestId = uuidv4();
    request.ctx.organisationId = getStringHeader(request, 'x-organisation-id');
    request.ctx.originApi = 'rest';

    // These will be populated by the auth plugin
    request.ctx.user = null;
    request.ctx.session = null;
    request.ctx.userOrganisations = [];
  });
});
