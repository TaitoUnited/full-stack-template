import multipart from '@fastify/multipart';
import cookie from '@fastify/cookie';

import { sessionRoutes } from '~/src/session/session.routes';
import { postRoutes } from '~/src/example/post/post.routes';
import { config } from '~/src/utils/config';
import { log } from '~/src/utils/log';
import { auth } from './auth';
import { contextPlugin } from './context';
import { type ServerInstance } from './server';
import { setupErrorHandler } from './error';
import { csrfPlugin } from './csrf';
import { setupGraphQL } from './graphql/server';
import { infraRoutes } from './infra.routes';
import { organisationRoutes } from '~/src/organisation/organisation.routes';
import { composeFastifyPlugins } from './compose-fastify-plugins';

export async function setupServer(server: ServerInstance) {
  server.register(multipart);

  // Adds cookie helpers to the server instance
  await server.register(cookie);

  /**
   * Include context (db, log, user, session, etc.) to the request lifecycle.
   * Accessible as `request.ctx` from route handlers.
   */
  await server.register(contextPlugin);

  /**
   * Cross-Site Request Forgery (CSRF) protection.
   * See: https://lucia-auth.com/guides/validate-session-cookies/
   */
  await server.register(csrfPlugin);

  /**
   * Setup error handler to catch and log errors.
   * Includes Sentry integration to capture exceptions.
   */
  setupErrorHandler(server);

  await setupGraphQL(server);

  console.log('registering auth.allowed for infra routes');
  await server.register(composeFastifyPlugins(auth.allowed, infraRoutes)); // health checks, etc.

  // NOTE: if you are using GraphQL for all your API endpoints, you can remove these:
  console.log('registering auth.allowed for session routes');
  await server.register(composeFastifyPlugins(auth.allowed, sessionRoutes)); // login, logout, etc.
  console.log('registering auth.ui for post routes');
  await server.register(composeFastifyPlugins(auth.ui, postRoutes));
  console.log('registering auth.ui for organisation routes');
  await server.register(composeFastifyPlugins(auth.ui, organisationRoutes));

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
