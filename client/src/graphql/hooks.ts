/* eslint-disable no-restricted-imports */
import {
  type DocumentNode,
  type NoInfer,
  type OperationVariables,
  type QueryHookOptions,
  type QueryRef,
  type SuspenseQueryHookOptions,
  type TypedDocumentNode,
  useQuery as useApolloQuery,
  useReadQuery as useApolloReadQuery,
  useSuspenseQuery as useApolloSuspenseQuery,
} from '@apollo/client';
import { equal } from '@wry/equality';
import { startTransition, useDeferredValue, useRef } from 'react';
import { useSpinDelay } from 'spin-delay';

import { useWindowFocusEffect } from '~/hooks/use-window-focus';

/**
 * Enhance `useQuery` hook to add support for refetching data on window focus.
 */
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
 * Enhance `useReadQuery` hook to stop the hook from suspending when `queryRef`
 * changes and instead return a `suspending` flag that can be used to shown
 * an inline loading indicator.
 */
export function useReadQuery<TData>(queryRef: QueryRef<TData>) {
  const deferredQueryRef = useDeferredValue(queryRef);
  const result = useApolloReadQuery(deferredQueryRef);

  /**
   * Add smart delay to prevent spinner flickering when variables change,
   * and tell when the query is suspending so that we can show an inline
   * loading indicator.
   */
  const suspending = useSpinDelay(deferredQueryRef !== queryRef);

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
      // eslint-disable-next-line promise/catch-or-return
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
