import { ApolloServer } from '@apollo/server';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';

import { config } from '~/common/config';
import { type ServerInstance } from '../server';
import { setupWebsocketServer } from './websocket';
import { protection } from './protection';
import { setupSchema } from './schema';

export async function setupGraphQL(server: ServerInstance) {
  const schema = setupSchema();

  const websocket = setupWebsocketServer(server, schema);

  const graphqlServer = new ApolloServer({
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

  await graphqlServer.start();
  await server.register(fastifyApollo(graphqlServer));
}
