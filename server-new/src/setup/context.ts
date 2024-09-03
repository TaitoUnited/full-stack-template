import { fastifyPlugin } from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

import { type ServerInstance } from './server';
import { log } from '~/utils/log';
import { getDb } from '~/db';
import { getAuth } from '~/utils/auth';

export const contextPlugin = fastifyPlugin(async (server: ServerInstance) => {
  server.addHook('onRequest', async (request) => {
    request.ctx = request.ctx || {};
    request.ctx.log = log;
    request.ctx.db = await getDb();
    request.ctx.auth = await getAuth();
    request.ctx.requestId = uuidv4();
    // These will be populated by the auth plugin
    request.ctx.user = null;
    request.ctx.session = null;
  });
});
