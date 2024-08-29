import type { FastifyReply, FastifyRequest } from 'fastify';
import { ApolloServer } from '@apollo/server';
import fastifyApollo, {
  type ApolloFastifyContextFunction,
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';

import { config } from '~/common/config';
import { type ServerInstance } from '../server';
import { setupWebsocketServer } from './websocket';
import { protection } from './protection';
import { setupSchema } from './schema';

export type GraphQlContext = FastifyRequest['ctx'] & {
  reply: FastifyReply;
};

export async function setupGraphQL(server: ServerInstance) {
  const schema = setupSchema();
  const websocket = setupWebsocketServer(server, schema);

  const graphqlServer = new ApolloServer<GraphQlContext>({
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

  const context: ApolloFastifyContextFunction<GraphQlContext> = async (
    request,
    reply
  ) => {
    /**
     * Just pass the context from the request to the Apollo server and
     * expose `reply` so that we are able to set cookies in resolvers.
     */
    return { ...request.ctx, reply };
  };

  await server.register(fastifyApollo(graphqlServer), { context });
}
