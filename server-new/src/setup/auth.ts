import { fastifyPlugin } from 'fastify-plugin';
import cookie from '@fastify/cookie';

import { type ServerInstance } from './server';

export const authPlugin = fastifyPlugin(async (server: ServerInstance) => {
  // Adds cookie helpers to the server instance
  await server.register(cookie);

  /**
   * Keep the session alive by automatically refreshing the session cookie.
   */
  server.addHook('preHandler', async (request, reply) => {
    const { auth } = request.ctx;
    const sessionId = auth.readSessionCookie(request.headers.cookie ?? '');

    if (!sessionId) {
      request.ctx.user = null;
      request.ctx.session = null;
      return;
    }

    const { session, user } = await auth.validateSession(sessionId);

    if (session && session.fresh) {
      const cookie = auth.createSessionCookie(session.id);
      reply.setCookie(cookie.name, cookie.value, cookie.attributes);
    }

    // If the session is invalid, clear the session cookie by setting a blank cookie
    if (!session) {
      const cookie = auth.createBlankSessionCookie();
      reply.setCookie(cookie.name, cookie.value, cookie.attributes);
    }

    request.ctx.user = user;
    request.ctx.session = session;
  });

  /**
   * Authenticate the request.
   *
   * This will be available via `server.authenticate` and can be used to protect
   * routes by adding a `onRequest: [server.authenticate]` option to the route
   * definition when creating new routes with `server.route`.
   */
  // @ts-expect-error - `decorate` has type issues...
  server.decorate('authenticate', async (request, reply) => {
    if (!request.user || !request.session) {
      reply.code(401).send('Unauthorized');
    }
  });
});
