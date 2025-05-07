import { fastifyPlugin } from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

import { type ServerInstance } from './server';
import { getDb } from '~/db';
import { log } from '~/src/utils/log';
import { getAuth } from '~/src/utils/authentication';
import { getStringHeader } from '~/src/utils/request';

export const contextPlugin = fastifyPlugin(async (server: ServerInstance) => {
  server.addHook('onRequest', async (request) => {
    request.ctx = request.ctx || {};
    request.ctx.log = log;
    request.ctx.db = await getDb();
    request.ctx.auth = await getAuth();
    request.ctx.requestId = uuidv4();
    request.ctx.organisationId = getStringHeader(request, 'x-organisation-id');

    // These will be populated by the auth plugin
    request.ctx.user = null;
    request.ctx.session = null;
    request.ctx.userOrganisations = [];
  });
});
