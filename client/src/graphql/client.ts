import { LocalStorageWrapper, CachePersistor } from 'apollo3-cache-persist';

import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
  // split,
} from '@apollo/client';
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
// import { createClient } from 'graphql-ws';

// import { getMainDefinition } from '@apollo/client/utilities';

import config from '~constants/config';
import storage from '~utils/storage';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '~services/i18n';

const cache = new InMemoryCache();

// This is used for preloading data outside of React
let __client__: ApolloClient<NormalizedCacheObject>;

export async function setupApolloClient() {
  const httpLink = new HttpLink({ uri: config.API_URL });

  // If you need to use subscriptions, uncomment the following lines
  // const wsUri = `${config.ENV === 'localhost' ? 'ws' : 'wss'}://${
  //   location.host
  // }${config.API_URL}/subscriptions`;

  // const wsLink = new GraphQLWsLink(
  //   createClient({
  //     url: wsUri,
  //   })
  // );

  const headersLink = new ApolloLink((operation, forward) => {
    const locales = SUPPORTED_LOCALES;
    const locale = storage.get('@app/locale');

    operation.setContext((context: any) => ({
      headers: {
        'Accept-Language': locales.includes(locale) ? locale : DEFAULT_LOCALE,
        ...context.headers,
      },
    }));

    return forward(operation);
  });

  const persistor = new CachePersistor({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });

  const shouldPurge = await shouldPurgeStorage();

  if (shouldPurge) {
    await persistor.purge();
  } else {
    await persistor.restore();
  }

  // If you need to use subscriptions, uncomment the following lines
  // const splitLink = split(
  //   ({ query }) => {
  //     const definition = getMainDefinition(query);
  //     return (
  //       definition.kind === 'OperationDefinition' &&
  //       definition.operation === 'subscription'
  //     );
  //   },
  //   wsLink,
  //   httpLink
  // );

  const client = new ApolloClient({
    // If you need to use subscriptions, change the following line to:
    // link: from([headersLink, splitLink]),
    link: from([headersLink, httpLink]),
    cache,
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
      watchQuery: {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
      },
    },
  });

  __client__ = client;

  return client;
}

export function getApolloClient() {
  return __client__;
}

type ClientQueryParams = Parameters<
  ApolloClient<NormalizedCacheObject>['query']
>[0];

export function query<
  Data = any,
  Variables extends OperationVariables = OperationVariables
>(query: ClientQueryParams['query'], variables?: Variables) {
  return __client__.query<Data, Variables>({
    query,
    variables,
    fetchPolicy: 'network-only',
  });
}

export type PreloadHandler = (
  params: null | Record<string, any>,
  trigger: 'click' | 'hover'
) => Promise<void>;

// https://github.com/apollographql/apollo-cache-persist/blob/master/docs/faq.md#ive-had-a-breaking-schema-change-how-do-i-migrate-or-purge-my-cache
const SCHEMA_VERSION = '1';
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

async function shouldPurgeStorage() {
  const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    return false;
  } else {
    localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
    return true;
  }
}
