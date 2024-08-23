import fp from 'fastify-plugin';
import { v4 as uuidv4 } from 'uuid';

import { log } from '~/common/log';
import { getDb } from '~/db';
import { type ServerInstance } from './server';

export const context = fp(async (server: ServerInstance) => {
  server.addHook('onRequest', async (request) => {
    request.ctx = request.ctx || {};
    request.ctx.log = log;
    request.ctx.db = await getDb();
    request.ctx.requestId = uuidv4();
  });
});
