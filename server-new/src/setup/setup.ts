import multipart from '@fastify/multipart';

import { config } from '~/common/config';
import { log } from '~/common/log';
import { auth } from './auth';
import { context } from './context';
import { infraRoutes } from './infra';
import { ServerInstance } from './server';
import { setupErrorHandler } from './error';
import { setupGraphQL } from './graphql/server';

export async function setupServer(server: ServerInstance) {
  server.register(multipart);

  /**
   * Parse JWT from cookies and expose `fastify.authenticate` decorator which can
   * be used to protect routes.
   */
  await server.register(auth);

  /**
   * Include context and transaction data to the request lifecycle.
   * Accessible as `request.ctx` from route handlers.
   */
  await server.register(context);

  /**
   * Setup error handler to catch and log errors.
   * Includes Sentry integration to capture exceptions.
   */
  setupErrorHandler(server);

  await setupGraphQL(server);

  // Infra routes (health checks, etc.)
  await server.register(infraRoutes);

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
