import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import loadable from '@loadable/component';
import { useParams, Route } from 'react-router-dom';
import Page from '~components/navigation/Page';

export function routeEntry<Data>({
  fallback,
  awaitLoader = true,
  component,
  loader,
}: RouteEntryOptions<Data>): RouteEntryConfig {
  const Component = loadable(component, { fallback });

  let loaderData: Data;

  async function load(params: LoaderParams) {
    const promises: Promise<any>[] = [Component.load()];

    if (!loaderData && loader) {
      promises.push(
        loader(params)
          .then(result => (loaderData = result))
          .catch(error => console.log('> Loader error', error))
      );
    }

    // Load code and data in parallel
    await Promise.all(promises);

    return loaderData;
  }

  function Entry() {
    const params = useParams();

    let initialStatus: LoaderStatus = 'pending';

    if (loaderData) {
      initialStatus = 'loaded';
    } else if (!awaitLoader) {
      initialStatus = 'skipped';
    }

    const [state, setState] = useState<LoaderState<Data>>({
      status: initialStatus,
      data: loaderData,
    });

    // Only do the load initially but not on subsequent route entry visits
    useEffect(() => {
      if (initialStatus === 'pending') {
        load(params).then(data => setState({ data, status: 'loaded' }));
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (state.status === 'pending') return fallback || null;

    return (
      <Page>
        <Component loaderData={state.data} />
      </Page>
    );
  }

  return { load, element: Entry };
}

// Render utils ----------------------------------------------------------------

export function renderRouteEntries(entries: RouteEntry[]) {
  return entries.map(({ path, entry }) => {
    const Element = entry.element;
    return <Route key={path} path={path} element={<Element />} />;
  });
}

// Context ---------------------------------------------------------------------

const RouteEntriesContext = createContext<RouteEntry[]>([]);

export function RouteLoaderProvider({
  routes,
  children,
}: {
  routes: RouteEntry[];
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

type LoaderState<Data> = {
  status: LoaderStatus;
  data?: Data;
};

export type RouteEntryOptions<Data> = {
  fallback?: JSX.Element;
  awaitLoader?: boolean;
  component: () => Promise<any>;
  loader?: (params: LoaderParams) => Promise<Data>;
};

export type RouteEntryConfig = {
  load: (params: LoaderParams) => Promise<any>;
  element: () => JSX.Element | null;
};

export type RouteEntry = {
  path: string;
  entry: RouteEntryConfig;
};
