import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';

import { config, getSecrets } from '~/common/config';
import { type ServerInstance } from './server';

export const auth = fp(async (server: ServerInstance) => {
  const secrets = await getSecrets();

  await server.register(jwt, {
    secret: secrets.SESSION_SECRET,
    cookie: { cookieName: config.SESSION_COOKIE, signed: false },
  });

  await server.register(cookie);

  /**
   * Authenticate the request using JWT.
   *
   * This will be available via `server.authenticate` and can be used to protect
   * routes by adding a `onRequest: [server.authenticate]` option to the route
   * definition when creating new routes with `server.route`.
   */
  // @ts-expect-error - `decorate` has type issues...
  server.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
