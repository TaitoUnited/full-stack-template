import type {
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import { type ServerInstance } from '../server';
import { organisationService } from '~/src/organisation/organisation.service';
import { AuthenticatedGraphQLRequest } from '../graphql/types';

export const uiAuthPlugin = fastifyPlugin(async (server: ServerInstance) => {
  server.addHook('preHandler', async (request, reply) => {
    const { auth, log } = request.ctx;

    request.ctx.__authenticator__ = 'auth.ui';
    log.info('Using "ui" authenticator');

    /**
     * Read the session ID from the cookie or the Authorization header
     */
    const sessionId =
      auth.readSessionCookie(request.headers.cookie ?? '') ||
      auth.readBearerToken(request.headers.authorization ?? '');

    // TODO: Implement refresh cycle: when the session is expired or close to expiring, refresh the OAuth tokens if
    // therefresh token is still valid and create a new session. Sessions already hold the refresh tokens, they are
    // just not utilised yet.

    // Session expired, clear request.ctx
    if (!sessionId) {
      request.ctx.user = null;
      return;
    }

    const { session, user } = await auth.validateSession(sessionId);

    // Extend the session cookie if the session is fresh.
    if (session && session.fresh) {
      const cookie = auth.createSessionCookie(session.id);
      reply.setCookie(cookie.name, cookie.value, cookie.attributes);
    }

    // If the session is invalid, clear the session cookie by setting a blank cookie
    if (!session) {
      const cookie = auth.createBlankSessionCookie();
      reply.setCookie(cookie.name, cookie.value, cookie.attributes);

      // No further action
      return;
    }

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
      request.ctx.user!.session = session;
    }
  });
});

/**
 * Ensure that context has user set.
 */
export function withUser<T extends RouteGenericInterface>(
  handler: (req: AuthenticatedGraphQLRequest<T>, res: FastifyReply) => void
) {
  return async (request: FastifyRequest<T>, reply: FastifyReply) => {
    if (!request.ctx.__authenticator__ || !request.ctx.user) {
      return reply.code(401).send('Unauthorized');
    }

    return handler(request as AuthenticatedGraphQLRequest<T>, reply);
  };
}
