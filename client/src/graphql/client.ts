import { ApolloClient, InMemoryCache } from '@apollo/client';
import config from '~constants/config';

export const apolloClient = new ApolloClient({
  uri: config.API_URL,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: { fetchPolicy: 'cache-first' },
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
});
