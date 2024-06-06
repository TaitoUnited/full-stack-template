import { startTransition, useDeferredValue, useRef } from 'react';
import { useSpinDelay } from 'spin-delay';
import { equal } from '@wry/equality';

import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery as useApolloQuery,
  useSuspenseQuery as useApolloSuspenseQuery,
  SuspenseQueryHookOptions,
} from '@apollo/client';

import { useWindowFocusEffect } from '~hooks/useWindowFocus';

// Re-export all hooks so that they can be used by graphql-codegen
export * from '@apollo/client'; // eslint-disable-line import/export

/**
 * Enhance `useQuery` hook to add support for refetching data on window focus.
 */
// eslint-disable-next-line import/export
export function useQuery<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>
) {
  const result = useApolloQuery<TData, TVariables>(query, options);

  useWindowFocusRefetching(result.refetch);

  return result;
}

/**
 * Enhance `useSuspenseQuery` hook to add better support for refetching on
 * window focus and stop the hook from suspending when variables change
 * and instead return a `suspending` flag that can be used to shown an inline
 * loading indicator.
 *
 * More info: https://www.teemutaskula.com/blog/exploring-query-suspense#deferring-with-usedeferredvalue
 * (the article is written for React Query but the same concept applies to Apollo)
 */
// eslint-disable-next-line import/export
export function useSuspenseQuery<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: SuspenseQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>
) {
  const variables = useDeferredValue(options?.variables);

  const result = useApolloSuspenseQuery<TData, TVariables>(query, {
    ...options,
    variables,
  });

  /**
   * Add smart delay to prevent spinner flickering when variables change,
   * and tell when the query is suspending so that we can show an inline
   * loading indicator.
   */
  const suspending = useSpinDelay(!equal(variables, options?.variables));

  useWindowFocusRefetching(result.refetch);

  return { ...result, suspending };
}

/**
 * Apollo doesn't provide a way to refetch queries when the browser window is
 * focused, eg. when user goes to another site and comes back.
 * https://github.com/apollographql/apollo-feature-requests/issues/422
 */
function useWindowFocusRefetching(refetch: () => Promise<any>) {
  const refetching = useRef(false);
  const refetchedAt = useRef(new Date().getTime());
  const refetchThreshold = 5000; // 5 seconds

  useWindowFocusEffect(async () => {
    const now = new Date().getTime();
    const elapsed = now - refetchedAt.current;

    // Don't refetch if the query was just fetched/refetched recently
    if (elapsed < refetchThreshold) return;

    // Prevent multiple refetches
    if (refetching.current) return;

    refetching.current = true;

    console.log('Window refocused, refetching query...');

    // Using `startTransition` prevents suspending the component
    startTransition(() => {
      refetch()
        .catch(error => {
          console.log('Failed to refetch query', error);
        })
        .finally(() => {
          console.log('Query refetched!');
          refetchedAt.current = new Date().getTime();
          refetching.current = false;
        });
    });
  });
}
