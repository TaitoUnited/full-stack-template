import fastifyPlugin from 'fastify-plugin';

import type { ServerInstance } from '~/setup/server';
import { base64 } from '~/src/utils/encoding';
import type { Initiator } from '~/setup/context';

export const basicAuthPlugin = fastifyPlugin(
  async (
    server: ServerInstance,
    opts: { initiator: Initiator; username: string; password: string }
  ) => {
    const ALLOWED = base64.encode(`${opts.username}:${opts.password}`);

    server.addHook('preHandler', async (request, reply) => {
      request.ctx.log.info(`Using "basic.${opts.initiator}" authenticator`);
      request.ctx.__authenticator__ = `auth.basic.${opts.initiator}`;

      const authHeader = request.headers.authorization ?? '';

      const credentialMatch = /Basic (.*)/.exec(authHeader);

      if (
        !credentialMatch ||
        !credentialMatch[1] ||
        credentialMatch[1] !== ALLOWED
      ) {
        request.ctx.log.info(
          `authentication failed using "basic.${opts.initiator}"`
        );
        return reply.status(403).send();
      }

      request.ctx.initiator = opts.initiator;
      request.ctx.log = request.ctx.log.child({ initiator: opts.initiator });
    });
  }
);
