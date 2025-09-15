import fastifyPlugin from 'fastify-plugin';

import type { ServerInstance } from '../server';

export const publicAuthPlugin = fastifyPlugin(
  async (server: ServerInstance) => {
    server.addHook('preHandler', async (request) => {
      request.ctx.log.info('Using "allowed" authenticator');
      request.ctx.__authenticator__ = 'auth.allowed';
      request.ctx.user = null;
      request.ctx.log = request.ctx.log.child({ userId: 'public' });
    });
    console.log('Registered public (allowed) auth plugin');
  }
);
