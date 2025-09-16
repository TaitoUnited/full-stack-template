import { fastifyPlugin } from 'fastify-plugin';

import { config } from '~/src/utils/config';
import { type ServerInstance } from './server';

// TODO: A more generic way to allow requests from non-browser without a origin header
const noOriginEndpoints: string[] = [];

export const csrfPlugin = fastifyPlugin(async (server: ServerInstance) => {
  server.addHook('preHandler', (request, reply, done) => {
    if (request.method === 'GET') return done();

    const hostHeader = ((request.headers['X-Forwarded-Host'] ||
      request.headers.host) ??
      null) as string | null;

    let originHeader = request.headers.origin ?? null;
    if (!originHeader && noOriginEndpoints.includes(request.url)) {
      originHeader = config.COMMON_URL ?? null;
    }

    if (
      !originHeader ||
      !hostHeader ||
      !config.COMMON_URL ||
      originHeader !== config.COMMON_URL
    ) {
      request.ctx.log.error(
        {
          originHeader,
          hostHeader,
          commonUrl: config.COMMON_URL,
        },
        'Invalid origin'
      );

      return reply.status(403).send('Invalid origin');
    }

    done();
  });
});
