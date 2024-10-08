// The following imports are only needed if you are using subscriptions or cache persistence.
/*
import { LocalStorageWrapper, CachePersistor } from 'apollo3-cache-persist';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
*/

import {
  // split,
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
} from '@apollo/client';

import { config } from '~constants/config';
import { storage } from '~utils/storage';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '~services/i18n';
import { authStore } from '~services/auth';

const cache = new InMemoryCache();

// This is used for querying data outside of React
let __client__: ApolloClient<NormalizedCacheObject>;

export async function setupApolloClient() {
  const httpLink = new HttpLink({ uri: `${config.API_URL}/graphql` });

  // If you need to use subscriptions, uncomment the following block:
  /*
  const wsUri = `${config.ENV === 'localhost' ? 'ws' : 'wss'}://${
    location.host
  }${config.API_URL}/subscriptions`;

  const wsLink = new GraphQLWsLink(createClient({ url: wsUri }));
  */

  const headersLink = new ApolloLink((operation, forward) => {
    const locales = SUPPORTED_LOCALES;
    const locale = storage.get('@app/locale');
    const { organisation } = authStore.getState();

    operation.setContext((context: any) => {
      const headers = {
        ...context.headers,
        'Accept-Language': locales.includes(locale) ? locale : DEFAULT_LOCALE,
      };

      if (organisation) {
        headers['X-Organisation-Id'] = organisation;
      }

      return { headers };
    });

    return forward(operation);
  });

  // If you want to persist the cache, uncomment the following block:
  /*
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
  */

  // If you need to use subscriptions, uncomment the following block
  /*
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );
  */

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

// The following function is only needed if you are using cache persistence:
/* 
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
*/
