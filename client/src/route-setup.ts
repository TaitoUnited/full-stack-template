import {
  type ApolloClient,
  createQueryPreloader,
  type NormalizedCacheObject,
} from '@apollo/client';
import { createRouter } from '@tanstack/react-router';

import { routeTree } from './route-tree.gen';

let __router__: ReturnType<typeof setupRouter>;

export function getRouter() {
  return __router__;
}

export function setupRouter(apolloClient: ApolloClient<NormalizedCacheObject>) {
  const preloadQuery = createQueryPreloader(apolloClient);

  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    context: { apolloClient, preloadQuery },
  });

  __router__ = router;

  return router;
}

declare module '@tanstack/react-router' {
  // Register must be an interface to correctly override types
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: ReturnType<typeof setupRouter>;
  }
}
