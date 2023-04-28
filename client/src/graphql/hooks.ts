import { useRef } from 'react';

import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  QueryResult as ApolloQueryResult,
  useQuery as useApolloQuery,
} from '@apollo/client';

import { useWindowFocusEffect } from '~utils/observe';

// Re-export all hooks so that they can be used by graphql-codegen
export * from '@apollo/client'; // eslint-disable-line import/export

// Add `revalidating` field to query result so that we are able to distinguish
// between initial data loading and subsequent data revalidating that happens
// in the background as part of Stale-While-Revalidate pattern
interface QueryResult<D, V extends OperationVariables>
  extends ApolloQueryResult<D, V> {
  revalidating: boolean;
}

// Enhance `useQuery` hook to add better support for Stale-While-Revalidate and Window-Focus-Refetching
// eslint-disable-next-line import/export
export function useQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables> | undefined
): QueryResult<TData, TVariables> {
  const q = useApolloQuery<TData, TVariables>(query, options) as QueryResult<
    TData,
    TVariables
  >;

  q.revalidating = false;

  // When using `cache-and-network` fetch policy the `loading` prop is set to true
  // every time the query data is refetched in the background causing issues
  // with loading skeleton placeholders
  // --> we want to keep the `loading` as false if the data is in the cache
  if (q.loading) {
    try {
      const cacheHit = q.client.readQuery({ query, variables: q.variables });

      if (cacheHit) {
        q.loading = false;
        q.revalidating = true;
      }
    } catch (error) {}
  }

  useQueryAutoRefetching(q);

  return q;
}

// Apollo doesn't provide a way to refetch queries when the browser window is
// focused, eg. when user goes to another site and comes back.
type RefetchableQuery = { refetch: () => Promise<any> };

function useQueryAutoRefetching(query: RefetchableQuery) {
  const refetching = useRef(false);

  useWindowFocusEffect(async () => {
    if (refetching.current) return;
    refetching.current = true;

    try {
      console.log('> Window refocused, refetching query...');
      await query.refetch();
    } catch (error) {
      console.log('> Failed to refetch query', error);
    } finally {
      console.log('> Query refetched!');
      refetching.current = false;
    }
  });
}
