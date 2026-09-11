import type { ApolloClient } from '@apollo/client';

let apolloClient: ApolloClient | undefined;

export function getApolloClient() {
  if (!apolloClient) {
    throw new Error('Apollo client has not been initialized.');
  }

  return apolloClient;
}

export function setApolloClient(client: ApolloClient) {
  apolloClient = client;
}
