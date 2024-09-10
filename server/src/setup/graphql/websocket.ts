import { WebSocketServer } from 'ws';
import { GraphQLSchema } from 'graphql';
import { ApolloServerPlugin } from '@apollo/server';
import { useServer } from 'graphql-ws/lib/use/ws';

import { type ServerInstance } from '../server';

export function setupWebsocketServer(
  server: ServerInstance,
  schema: GraphQLSchema
) {
  const wsServer = new WebSocketServer({
    server: server.server,
    path: '/subscriptions',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  // Proper shutdown for the WebSocket server
  const websocketPlugin: ApolloServerPlugin = {
    async serverWillStart() {
      return {
        async drainServer() {
          await serverCleanup.dispose();
        },
      };
    },
  };

  return { plugins: [websocketPlugin], wsServer };
}
