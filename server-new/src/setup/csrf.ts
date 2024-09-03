import { fastifyPlugin } from 'fastify-plugin';
import { verifyRequestOrigin } from 'lucia';

import { ServerInstance } from './server';
import { log } from '~/utils/log';

export const csrfPlugin = fastifyPlugin(
  async (server: ServerInstance, opts: { enabled: boolean }) => {
    if (!opts.enabled) return;

    server.addHook('preHandler', (request, reply, done) => {
      if (request.method === 'GET') return done();

      const originHeader = request.headers.origin ?? null;
      const hostHeader = ((request.headers['X-Forwarded-Host'] ||
        request.headers.host) ??
        null) as string | null;

      if (
        !originHeader ||
        !hostHeader ||
        !verifyRequestOrigin(originHeader, [hostHeader])
      ) {
        log.error('Invalid origin', { originHeader, hostHeader });
        return reply.status(403);
      }
    });
  }
);
