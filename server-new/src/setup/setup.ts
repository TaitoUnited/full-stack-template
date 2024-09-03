import multipart from '@fastify/multipart';

import { config } from '~/utils/config';
import { log } from '~/utils/log';
import { authPlugin } from './auth';
import { contextPlugin } from './context';
import { type ServerInstance } from './server';
import { setupErrorHandler } from './error';
import { setupGraphQL } from './graphql/server';
import { infraRoutes } from './infra.routes';
import { sessionRoutes } from '~/domain/session/session.routes';
import { csrfPlugin } from './csrf';

export async function setupServer(server: ServerInstance) {
  server.register(multipart);

  /**
   * Include context (db, log, user, session, etc.) to the request lifecycle.
   * Accessible as `request.ctx` from route handlers.
   */
  await server.register(contextPlugin);

  /**
   * Cross-Site Request Forgery (CSRF) protection for production environments.
   * See: https://lucia-auth.com/guides/validate-session-cookies/
   */
  await server.register(csrfPlugin, {
    enabled: config.NODE_ENV === 'production',
  });

  /**
   * Parse and validate the session from cookies and expose `fastify.authenticate`
   * decorator which can be used to protect REST endpoints.
   */
  await server.register(authPlugin);

  /**
   * Setup error handler to catch and log errors.
   * Includes Sentry integration to capture exceptions.
   */
  setupErrorHandler(server);

  await setupGraphQL(server);

  await server.register(infraRoutes); // health checks, etc.
  await server.register(sessionRoutes); // login, logout, etc.

  server.listen(
    { port: config.API_PORT, host: config.API_BINDADDR },
    (err, address) => {
      if (err) {
        console.error(err);
        server.log.error(err);
        // eslint-disable-next-line n/no-process-exit
        process.exit(1);
      }

      log.info(
        {
          name: config.APP_NAME,
          address: config.API_BINDADDR,
          port: config.API_PORT,
        },
        `Server listening at ${address}`
      );
    }
  );
}
