import { fastifyPlugin } from 'fastify-plugin';
import cookie from '@fastify/cookie';

import { type ServerInstance } from './server';
import { getUserOrganisationsWithRoles } from '~/src/organisation/organisation.service';
import { hasValidSession } from '~/src/utils/authentication';
import { hasValidOrganisation } from '~/src/utils/authorisation';

export const authPlugin = fastifyPlugin(async (server: ServerInstance) => {
  // Adds cookie helpers to the server instance
  await server.register(cookie);

  server.addHook('preHandler', async (request, reply) => {
    const { auth } = request.ctx;

    /**
     * Read the session ID from the cookie or the Authorization header depending
     * on whether the request is coming from a browser or a mobile app client.
     */
    const sessionId =
      auth.readSessionCookie(request.headers.cookie ?? '') ||
      auth.readBearerToken(request.headers.authorization ?? '');

    if (!sessionId) {
      request.ctx.user = null;
      request.ctx.session = null;
      return;
    }

    const { session, user } = await auth.validateSession(sessionId);

    /**
     * Extend the session cookie if the session is fresh.
     * TODO: how do we extend the session for mobile clients?
     * Do we for example update the `expiresAt` of the session in the database?
     * https://github.com/lucia-auth/lucia/discussions/652
     */
    if (session && session.fresh) {
      const cookie = auth.createSessionCookie(session.id);
      reply.setCookie(cookie.name, cookie.value, cookie.attributes);
    }

    // If the session is invalid, clear the session cookie by setting a blank cookie
    if (!session) {
      const cookie = auth.createBlankSessionCookie();
      reply.setCookie(cookie.name, cookie.value, cookie.attributes);
    }

    request.ctx.session = session;

    /**
     * Populate the available organisations with the associated role
     * for the user in the request context.
     */
    if (user) {
      const userOrganisations = await getUserOrganisationsWithRoles(
        request.ctx.db,
        user.id
      );

      request.ctx.user = user;
      request.ctx.userOrganisations = userOrganisations.map((row) => ({
        id: row.organisationId,
        role: row.role,
      }));
    }
  });

  /**
   * Authenticate the request.
   *
   * These will be available via `server.authenticate|etc` and can be used to
   * protect routes by adding a `onRequest: [server.{ensureSession,authenticate,etc}]`,
   * option to the route definition when creating new routes with `server.route`.
   */

  // @ts-expect-error - `decorate` has type issues...
  server.decorate('ensureSession', async (request, reply) => {
    if (!hasValidSession(request.ctx)) {
      reply.code(401).send('Unauthorized');
    }
  });

  // @ts-expect-error - `decorate` has type issues...
  server.decorate('ensureOrganisation', async (request, reply) => {
    if (!hasValidOrganisation(request.ctx)) {
      reply.code(401).send('Unauthorized');
    }
  });

  // @ts-expect-error - `decorate` has type issues...
  server.decorate('authenticate', async (request, reply) => {
    // User is fully authenticated if they have a valid session and an organisation
    if (!hasValidSession(request.ctx) || !hasValidOrganisation(request.ctx)) {
      reply.code(401).send('Unauthorized');
    }
  });
});
