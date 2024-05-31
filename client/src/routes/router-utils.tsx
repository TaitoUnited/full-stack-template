import { lazy } from '@loadable/component';
import { ComponentType, Suspense, useContext, useEffect, useRef } from 'react';

import {
  matchRoutes,
  RouteObject,
  useNavigation,
  UNSAFE_DataRouterContext,
} from 'react-router-dom';

import { RouteSpinner } from './RouteSpinner';
import { RouteError } from './RouteError';

type PreloadableRoute = RouteObject & {
  preload?: () => void;
};

/**
 * A helper function to create a lazy route component with preloading support.
 *
 * Use this instead of `React.lazy` or React Router's `lazy` to have a better
 * interoperability with React Suspense
 */
export function lazyRoute<Props>(
  routeImport: () => Promise<{ default: ComponentType<Props> }>
) {
  const Route = lazy<any>(routeImport);

  function Component() {
    return (
      <Suspense fallback={<RouteSpinner />}>
        <Route />
      </Suspense>
    );
  }

  return {
    Component,
    preload: Route.preload,
    errorElement: <RouteError />,
  } satisfies PreloadableRoute;
}

const hour = 3600000;
const staleTime = hour * 12;

/**
 * If the user has been on the page for over 12 hours, the next link
 * click will do a full page transition to get new code.
 */
export function useRouteStaleReloading() {
  const stale = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
    // See: https://reactrouter.com/en/main/hooks/use-navigation
    const isRegularNavigation =
      navigation.state === 'loading' && navigation.formData == null;

    if (isRegularNavigation && stale.current) {
      setTimeout(() => window.location.reload(), 100);
    }
  }, [navigation]);

  useEffect(() => {
    const id = setTimeout(() => {
      stale.current = true;
    }, staleTime);

    return () => clearTimeout(id);
  }, []);
}

/**
 * Listen to all link mouse down / touch start events and see if the element
 * has `data-preload` attribute, if it does preload the route component.
 */
export function useRoutePreloading() {
  const routerContext = useContext(UNSAFE_DataRouterContext);

  useEffect(() => {
    if (!routerContext) return;

    const { router } = routerContext;

    function handleMouseDown(event: MouseEvent | TouchEvent) {
      const target = event.target as HTMLElement;

      if (target.tagName === 'A' && target.dataset?.preload) {
        const href = target.getAttribute('href');
        if (!href) return;

        const routeMatches = matchRoutes(router.routes, { pathname: href });
        if (!routeMatches) return;

        const bestMatch = routeMatches[routeMatches.length - 1];

        if (
          bestMatch &&
          'preload' in bestMatch.route &&
          typeof bestMatch.route.preload === 'function'
        ) {
          bestMatch.route.preload();
        }
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleMouseDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- Routes are static
}
