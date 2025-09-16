import { ApolloServer } from '@apollo/server';
import {
  fastifyApolloDrainPlugin,
  fastifyApolloHandler,
} from '@as-integrations/fastify';

import { config } from '~/src/utils/config';
import { type ServerInstance } from '../server';
import { protection } from './protection';
import { setupSchema } from './schema';
import { GraphQlContext } from './types';
import { setupWebsocketServer } from './websocket';

export async function setupGraphQL(server: ServerInstance) {
  const schema = setupSchema();
  const websocket = setupWebsocketServer(server, schema);

  const apolloServer = new ApolloServer({
    schema,
    introspection: config.API_PLAYGROUND_ENABLED,
    // Protection settings for things like query depth/complexity limits
    ...protection,
    plugins: [
      // Proper shutdown for the HTTP server
      fastifyApolloDrainPlugin(server),
      ...websocket.plugins,
      ...protection.plugins,
    ],
  });

  await apolloServer.start();

  server.route({
    url: '/graphql',
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (request, reply) => {
      /**
       * Wrap the request in a transaction so that all resolvers share the same
       * database connection and don't overwhelm the database with connections
       * when resolvers are running in parallel.
       * Additionally, this allows for a single transaction to be used for the
       * entire request which enables transaction isolation:
       * https://www.postgresql.org/docs/current/transaction-iso.html
       */
      return request.ctx.db.transaction(async (tx) => {
        const handler = fastifyApolloHandler(apolloServer, {
          context: async () => {
            return {
              ...request.ctx,
              reply,
              /**
               * Overwrite the `db` with the transaction `tx`.
               * If you need to access the original database connection, you can
               * add it to the context as `_db` or similar.
               */
              db: tx,
              /**
               * Overwrite the operation context so that we know which operations
               * occur in the context of a GraphQL request.
               */
              initiator: 'graphql',
            } satisfies GraphQlContext;
          },
        });

        // Typing this is tricky and using `any` here is fine...
        return (handler as any)(request, reply);
      });
    },
  });
}
