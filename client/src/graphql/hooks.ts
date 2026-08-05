/* oxlint-disable no-restricted-imports */
import type {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client';
import {
  type QueryRef,
  useQuery as useApolloQuery,
  useReadQuery as useApolloReadQuery,
  useSuspenseQuery as useApolloSuspenseQuery,
} from '@apollo/client/react';
import { equal } from '@wry/equality';
import { useDeferredValue } from 'react';
import { useSpinDelay } from 'spin-delay';

/**
 * Enhance `useQuery` hook to add support for refetching data on window focus.
 */
export function useQuery<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: useApolloQuery.Options<NoInfer<TData>, NoInfer<TVariables>>
) {
  const result = useApolloQuery<TData, TVariables>(query, options!);

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
  options?: useApolloSuspenseQuery.Options<NoInfer<TVariables>>
) {
  const variables = useDeferredValue(options?.variables);

  const result = useApolloSuspenseQuery<TData, TVariables>(query, {
    ...options!,
    variables,
  });

  /**
   * Add smart delay to prevent spinner flickering when variables change,
   * and tell when the query is suspending so that we can show an inline
   * loading indicator.
   */
  const suspending = useSpinDelay(!equal(variables, options?.variables));

  /**
   * TODO: figure out if it possible to do refetching on window focus
   * with suspense queries. We previously used `startTransition` to prevent
   * the fallback from showing when refetching the query but that caused some
   * extremely weird bugs with other usages of `usaDeferredValue` in the app.
   * Basically whenever we refetched any suspense queries all other deferred
   * values would just completely break and any memoed components that used
   * those values would never re-trigger their `useEffect` hooks.
   * No idea what the solution is yet so it's better to disable refetching for now.
   */
  // useWindowFocusRefetching(result.refetch);

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
