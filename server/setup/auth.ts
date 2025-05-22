import cookie from '@fastify/cookie';
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import { organisationService } from '~/src/organisation/organisation.service';
import { hasValidSession } from '~/src/utils/authentication';
import { AuthenticatedRESTRequest } from './rest/types';
import { type ServerInstance } from './server';

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
      const userOrganisations =
        await organisationService.getUserOrganisationsWithRoles(
          request.ctx,
          user.id
        );

      request.ctx.user = user;
      request.ctx.userOrganisations = userOrganisations.map((row) => ({
        id: row.organisationId,
        role: row.role,
      }));
    }
  });
});

/**
 * Authenticate a REST api request. Use when defining new routes with `server.route` like so:
 *
 * server.route({
 *   ...
 *   handler: withAuth(async (request, reply) => {
 *     ...
 *   }),
 * });
 */
export function withAuth<T extends RouteGenericInterface>(
  handler: (req: AuthenticatedRESTRequest<T>, res: FastifyReply) => void
) {
  return async (request: FastifyRequest<T>, reply: FastifyReply) => {
    if (!hasValidSession(request.ctx)) {
      reply.code(401).send('Unauthorized');
    }

    return handler(request as AuthenticatedRESTRequest<T>, reply);
  };
}
