import { fastifyPlugin } from 'fastify-plugin';
import { verifyRequestOrigin } from 'lucia';

import { ServerInstance } from './server';
import { log } from '~/utils/log';
import { config } from '~/utils/config';

export const csrfPlugin = fastifyPlugin(async (server: ServerInstance) => {
  server.addHook('preHandler', (request, reply, done) => {
    if (request.method === 'GET') return done();

    const originHeader = request.headers.origin ?? null;
    const hostHeader = ((request.headers['X-Forwarded-Host'] ||
      request.headers.host) ??
      null) as string | null;

    if (
      !originHeader ||
      !hostHeader ||
      !config.COMMON_URL ||
      !verifyRequestOrigin(originHeader, [config.COMMON_URL])
    ) {
      log.error('Invalid origin', {
        originHeader,
        hostHeader,
        commonUrl: config.COMMON_URL,
      });

      return reply.status(403).send('Invalid origin');
    }

    done();
  });
});
