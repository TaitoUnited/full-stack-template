import loadable from '@loadable/component';
import { useLingui } from '@lingui/react';
import { useParams, Route, useSearchParams } from 'react-router-dom';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import Page from '~components/navigation/Page';
import { useFallbackDelay } from '~utils/promise';
import { genId } from '~utils/fn';
import { prettyLog } from '~utils/log';
import { Feature, isFeatureEnabled } from '~utils/feature-flags';

export function routeEntry<
  Data,
  Path extends string,
  SearchParams extends SearchParamOptions
>({
  path,
  searchParams: searchParamsOptions,
  fallback,
  featureFlag,
  awaitLoader = true,
  debug = false,
  component,
  loader,
}: RouteEntryOptions<Data, Path, SearchParams>): RouteEntryConfig<Data, Path> {
  const Component = loadable(component);
  const dataCache: LoaderDataCache<Data | null> = {};
  const loaderCache: LoaderCache<Data> = {};
  const entryKey = genId();

  let componentLoaded = false;

  async function performLoad(
    params: LoaderParams<ExtractPathParams<Path>, SearchParams>
  ) {
    const cacheKey = getCacheKey(params, entryKey);
    const promises: Promise<any>[] = [];

    if (!componentLoaded) {
      promises.push(
        Component.load().then(() => {
          componentLoaded = true;
          if (debug) prettyLog('Component loaded!');
        })
      );
    }

    if (loader) {
      promises.push(
        loader(params as LoaderParams<ExtractPathParams<Path>, SearchParams>)
          .then(result => {
            dataCache[cacheKey] = result;
            if (debug) prettyLog('Loader data loaded!', result);
          })
          .catch(error => console.log('Loader error', error))
      );
    } else if (debug) {
      prettyLog('Loader not defined');
    }

    // Load code and data in parallel
    await Promise.all(promises).then(() => {
      // NOTE: set cache data to null only after all promises have resolved
      // so that the deduping logic works correctly (does not do early return)
      if (dataCache[cacheKey] === undefined) {
        dataCache[cacheKey] = null;
        if (debug) prettyLog('No loader data, defaulting cache to null');
      }
    });

    return dataCache[cacheKey];
  }

  async function load(
    params: LoaderParams<ExtractPathParams<Path>, SearchParams>
  ) {
    // Loader should be used for the initial loading of data only so keep returning
    // the same data for all subsequent calls. Data should be refreshed with a lib
    // specific method like apollo's `pollInterval` or react-query's `staleTime` etc.
    const cacheKey = getCacheKey(params, entryKey);

    if (dataCache[cacheKey] !== undefined) {
      if (debug) prettyLog('Loader data cached!', dataCache[cacheKey]);
      return dataCache[cacheKey];
    }

    // Dedupe loaders so that we don't initialize multiple loaders if a pending
    // loading is still in progress.
    if (!loaderCache[cacheKey]) {
      loaderCache[cacheKey] = performLoad(params);

      if (debug) {
        const hasParams = Object.keys(params).length > 0;
        prettyLog(
          hasParams ? 'Calling loader with params' : 'Calling loader',
          hasParams ? params : undefined
        );
      }
    } else if (debug) {
      prettyLog('Loader already in progress, deduping...');
    }

    return loaderCache[cacheKey].finally(() => {
      delete loaderCache[cacheKey];
    });
  }

  function Entry() {
    const params = useParams();
    const parsedSearchParams = useParsedSearchParams(searchParamsOptions);
    const enabled = featureFlag ? isFeatureEnabled(featureFlag) : true;

    const [state, setState] = useState<LoaderState<Data>>(() => {
      const cacheKey = getCacheKey(params, entryKey);
      const data = dataCache[cacheKey];

      let status: LoaderStatus = 'pending';

      if (data !== undefined && componentLoaded) {
        status = 'loaded';
      } else if (!awaitLoader) {
        status = 'skipped';
      }

      return { status, data };
    });

    // By default we delay showing the fallback by 500ms in case the data loads
    // quickly. If the data takes longer than 500ms to load, we show the fallback
    // at least for 200ms to avoid a flash of skeleton placeholders.
    const showFallback = useFallbackDelay(state.status === 'pending');

    // Only do the load initially but not on subsequent route entry visits
    useEffect(() => {
      if (enabled && state.status === 'pending') {
        const loaderParams = {
          ...params,
          searchParams: parsedSearchParams,
        } as LoaderParams<ExtractPathParams<Path>, SearchParams>;

        load(loaderParams).then(data => setState({ data, status: 'loaded' }));
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Ensure that using `t` macro updates correctly within the route
    useLingui();

    if (!enabled) {
      return null;
    }

    if (state.status === 'pending') {
      return showFallback ? fallback || null : null;
    }

    return (
      <Page>
        <Component loaderData={state.data} />
      </Page>
    );
  }

  return { path, load, element: Entry, searchParamsOptions };
}

// Utils ----------------------------------------------------------------

export function renderRouteEntries<T extends RouteEntries>(entries: T) {
  validateRouteEntries(entries);
  return entries.map(({ path, entry, children = [] }) => {
    const Element = entry.element;
    return (
      <Route key={path} path={path} element={<Element />}>
        {renderRouteEntries(children)}
      </Route>
    );
  });
}

export function parseEntrySearchParams({
  searchParams,
  searchParamsOptions,
}: {
  searchParams: URLSearchParams;
  searchParamsOptions?: SearchParamOptions;
}) {
  const parsed: ParsedSearchParams = {};

  Array.from(searchParams.entries()).forEach(([key, value]) => {
    parsed[key] = value;

    if (searchParamsOptions && searchParamsOptions[key]) {
      const paramType = searchParamsOptions[key];

      if (paramType === 'number') {
        parsed[key] = Number(value);
      } else if (paramType === 'boolean') {
        parsed[key] = value === 'true';
      } else if (paramType === 'object') {
        try {
          parsed[key] = JSON.parse(value);
        } catch (error) {
          console.warn('> Failed to parse search param as JSON', error);
          parsed[key] = {};
        }
      } else {
        parsed[key] = value; // string is the default
      }
    }
  });

  return parsed;
}

function useParsedSearchParams(searchParamsOptions?: SearchParamOptions) {
  const [searchParams] = useSearchParams();
  return parseEntrySearchParams({ searchParams, searchParamsOptions });
}

function validateRouteEntries<T extends RouteEntries>(routes: T) {
  routes.forEach(route => {
    if (route.path !== route.entry.path) {
      console.error(
        `Route entry validation error: path "${route.path}" does not match entry path "${route.entry.path}"`
      );
    }
  });
}

// Context ---------------------------------------------------------------------
// Provide route entries via context to avoid cyclical import issues with Link
const RouteEntriesContext = createContext<RouteEntry<any, string>[]>([]);

export function RouteEntryProvider({
  routes,
  children,
}: {
  routes: RouteEntry<any, string>[];
  children: ReactNode;
}) {
  return (
    <RouteEntriesContext.Provider value={routes}>
      {children}
    </RouteEntriesContext.Provider>
  );
}

export function useRouteEntries() {
  return useContext(RouteEntriesContext);
}

// Types -----------------------------------------------------------------------

export type SearchParamOptions = Record<
  string,
  'string' | 'number' | 'boolean' | 'object'
>;

export type ParsedSearchParams = Record<
  string,
  string | number | boolean | Record<string, any>
>;

export type LoaderParams<
  PathParams extends string, // union of path param strings, eg. 'id' | 'slug'
  SearchParams extends SearchParamOptions = Record<string, any>
> = Record<PathParams, string> & {
  searchParams: {
    [K in keyof SearchParams]: SearchParams[K] extends 'boolean'
      ? boolean | undefined
      : SearchParams[K] extends 'number'
      ? number | undefined
      : SearchParams[K] extends 'object'
      ? Record<string, unknown> | undefined
      : string | undefined;
  };
};

export type LoaderStatus = 'pending' | 'skipped' | 'loaded';

export type LoaderDataCache<Data> = Record<string, Data>;

export type LoaderCache<Data> = Record<string, Promise<Data | null>>;

export type LoaderState<Data> = {
  status: LoaderStatus;
  data?: Data | null;
};

type ExtractPathParams<T extends string> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends `${infer Start}:${infer Param}`
    ? Param
    : never;

export type RouteEntryOptions<
  Data,
  Path extends string,
  SearchParams extends SearchParamOptions
> = {
  /* Whether to log debug messages. */
  debug?: boolean;
  /* Path to match for the route. */
  path: Path;
  /* If a feature flag is given this route will only render when that flag is enabled */
  featureFlag?: Feature;
  /* Search params options to parse the search params into the correct types. */
  searchParams?: SearchParams;
  /* Fallback React component to show while the route data and lazy loaded component is being loaded. */
  fallback?: JSX.Element;
  /* Whether to wait for the loader to finish before showing the fallback. */
  awaitLoader?: boolean;
  /* Lazy loaded React component to render when the route is active. */
  component: () => Promise<any>;
  /* Loader function to load data for the route. Should return the data that the route needs. */
  loader?: (
    params: LoaderParams<ExtractPathParams<Path>, SearchParams>
  ) => Promise<Data>;
};

export type RouteEntryConfig<Data, Path extends string> = {
  path: Path;
  searchParamsOptions?: SearchParamOptions;
  load: (
    params: LoaderParams<ExtractPathParams<Path>, any>
  ) => Promise<Data | null>;
  element: () => JSX.Element | null;
};

export type RouteEntryLoaderData<T extends RouteEntryConfig<any, string>> =
  NonNullable<Awaited<ReturnType<T['load']>>>;

export type RouteEntry<Data, Path extends string> = {
  path: Path;
  entry: RouteEntryConfig<Data, Path>;
  children?: RouteEntry<any, any>[];
};

export type RouteEntries = RouteEntry<any, any>[];

// Random helpers -------------------------------------------------------------

function getCacheKey(obj: Record<any, any>, entryKey: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { searchParams, ...queryParams } = obj;

  const paramsKey = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join(',');
  const key = `${entryKey}:${paramsKey}`;
  return key;
}
