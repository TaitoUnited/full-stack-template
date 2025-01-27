import { useEffect, useState } from 'react';

type FetchState<T> = {
  data: T;
  status: 'initial' | 'loading' | 'success' | 'error';
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

/**
 * A helper hook to fetch data from an REST API.
 *
 * This is useful for fetching data outside of the GraphQL API in scenarios
 * where the data needs to be longterm cached in the browser.
 * As all GraphQL queries use POST requests, they are not cached by the browser
 * if the API returns caching related headers such as `Cache-Control` or `ETag`.
 * This hook uses standard `fetch` API which performs a GET request and thus
 * allows the browser to cache the response when needed.
 */
export function useFetch<T>(params: {
  url: string;
  initialData: T;
  enabled?: boolean;
}): FetchState<T>;
export function useFetch<T>(params: {
  url: string;
  initialData?: T;
  enabled?: boolean;
}): FetchState<T | undefined>;
export function useFetch<T>({
  url,
  initialData = undefined,
  enabled = true,
}: {
  url: string;
  initialData?: T;
  enabled?: boolean;
}) {
  const [state, setState] = useState<{
    data?: T;
    status: 'initial' | 'loading' | 'success' | 'error';
  }>({
    data: initialData,
    status: 'initial',
  });

  useEffect(() => {
    async function fetchData(signal: AbortSignal) {
      try {
        setState(p => ({ ...p, status: 'loading' }));

        const response = await fetch(url, { signal });

        if (response.ok) {
          const newData = await response.json();
          setState({ data: newData, status: 'success' });
        } else {
          setState(p => ({ ...p, status: 'error' }));
        }
      } catch (err: any) {
        // Ignore abort errors
        if (err.name === 'AbortError') return;

        console.error('Error fetching data:', err);
        setState(p => ({ ...p, status: 'error' }));
      }
    }

    if (enabled) {
      const abortController = new AbortController();

      fetchData(abortController.signal);

      return () => {
        abortController.abort();
      };
    }
  }, [enabled, url]);

  return {
    ...state,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}
