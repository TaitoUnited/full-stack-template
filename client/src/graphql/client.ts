import { LocalStorageWrapper, CachePersistor } from 'apollo3-cache-persist';

import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

import config from '~constants/config';

const cache = new InMemoryCache();

// This is used for preloading data outside of React
let __client__: ApolloClient<NormalizedCacheObject>;

export async function setupApolloClient() {
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

  const client = new ApolloClient({
    uri: config.API_URL,
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

export function query<Result extends { data: any }>(
  query: ClientQueryParams['query'],
  variables?: ClientQueryParams['variables']
) {
  return __client__.query<Result['data'], any>({
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
