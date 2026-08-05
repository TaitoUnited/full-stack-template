import { useEffect, useState } from 'react';
import { type output, type ZodType } from 'zod';

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
export function useFetch<Schema extends ZodType>(params: {
  url: string;
  schema: Schema;
  initialData: output<Schema>;
  enabled?: boolean;
}): FetchState<output<Schema>>;
export function useFetch<Schema extends ZodType>(params: {
  url: string;
  schema: Schema;
  initialData?: output<Schema>;
  enabled?: boolean;
}): FetchState<output<Schema> | undefined>;
export function useFetch<Schema extends ZodType>({
  url,
  schema,
  initialData,
  enabled = true,
}: {
  url: string;
  schema: Schema;
  initialData?: output<Schema>;
  enabled?: boolean;
}) {
  const [state, setState] = useState<{
    data?: output<Schema>;
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
          const responseBody: unknown = await response.json();
          const newData = schema.parse(responseBody);
          setState({ data: newData, status: 'success' });
        } else {
          setState(p => ({ ...p, status: 'error' }));
        }
      } catch (error) {
        // Ignore abort errors
        if (error instanceof DOMException && error.name === 'AbortError')
          return;

        console.error('Error fetching data:', error);
        setState(p => ({ ...p, status: 'error' }));
      }
    }

    if (enabled) {
      const abortController = new AbortController();

      void fetchData(abortController.signal);

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
