import loadable from '@loadable/component';
import { useParams, Route } from 'react-router-dom';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import Page from '~components/navigation/Page';

export function routeEntry<Data>({
  fallback,
  awaitLoader = true,
  debug = false,
  component,
  loader,
}: RouteEntryOptions<Data>): RouteEntryConfig<Data> {
  const Component = loadable(component);

  const dataCache: LoaderDataCache<Data | null> = {};
  const loaderCache: LoaderCache<Data> = {};
  const entryKey = genId();

  let componentLoaded = false;

  async function performLoad(params: LoaderParams) {
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
        loader(params)
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

  async function load(params: LoaderParams) {
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

    // Only do the load initially but not on subsequent route entry visits
    useEffect(() => {
      if (state.status === 'pending') {
        load(params).then(data => setState({ data, status: 'loaded' }));
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (state.status === 'pending') {
      return fallback || null;
    }

    return (
      <Page>
        <Component loaderData={state.data} />
      </Page>
    );
  }

  return { load, element: Entry };
}

// Render utils ----------------------------------------------------------------

export function renderRouteEntries(entries: RouteEntry<any>[]) {
  return entries.map(({ path, entry }) => {
    const Element = entry.element;
    return <Route key={path} path={path} element={<Element />} />;
  });
}

// Context ---------------------------------------------------------------------
// Provide route entries via context to avoid cyclical import issues with Link
const RouteEntriesContext = createContext<RouteEntry<any>[]>([]);

export function RouteEntryProvider({
  routes,
  children,
}: {
  routes: RouteEntry<any>[];
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

type LoaderParams = Record<string, unknown>;

type LoaderStatus = 'pending' | 'skipped' | 'loaded';

type LoaderDataCache<Data> = Record<string, Data>;

type LoaderCache<Data> = Record<string, Promise<Data | null>>;

type LoaderState<Data> = {
  status: LoaderStatus;
  data?: Data | null;
};

export type RouteEntryOptions<Data> = {
  debug?: boolean;
  fallback?: JSX.Element;
  awaitLoader?: boolean;
  component: () => Promise<any>;
  loader?: (params: LoaderParams) => Promise<Data>;
};

export type RouteEntryConfig<Data> = {
  load: (params: LoaderParams) => Promise<Data | null>;
  element: () => JSX.Element | null;
};

export type RouteEntryLoaderData<T extends RouteEntryConfig<any>> = NonNullable<
  Awaited<ReturnType<T['load']>>
>;

export type RouteEntry<Data> = {
  path: string;
  entry: RouteEntryConfig<Data>;
};

export type RouteEntries = RouteEntry<any>[];

// Random helpers -------------------------------------------------------------

function prettyLog(msg: string, data?: any) {
  console.log(
    `%c${msg}`,
    `
      background: #cbeccb;
      color: #084922;
      border-radius: 99px;
      padding-left: 4px;
      padding-right: 4px;
      padding-top: 1px;
      padding-bottom: 1px;
    `
  );
  if (data) console.log(data);
}

function genId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function getCacheKey(obj: object, entryKey: string) {
  const paramsKey = Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join(',');
  const key = `${entryKey}:${paramsKey}`;
  return key;
}
