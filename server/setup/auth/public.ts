import fastifyPlugin from 'fastify-plugin';

import type { ServerInstance } from '../server';

export const publicAuthPlugin = fastifyPlugin((server: ServerInstance) => {
  server.addHook('preHandler', (request) => {
    request.ctx.log.info('Using "allowed" authenticator');
    request.ctx.__authenticator__ = 'auth.allowed';
    request.ctx.user = null;
    request.ctx.log = request.ctx.log.child({ userId: 'public' });
  });
});
