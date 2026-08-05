import type { ApolloClient } from '@apollo/client';
import type { PreloadQueryFunction } from '@apollo/client/react';
import {
  createRootRouteWithContext,
  Outlet,
  useRouter,
} from '@tanstack/react-router';
import { lazy } from 'react';
import { RouterProvider as AriaRouterProvider } from 'react-aria-components';
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';

import { authStore, verifyAuth } from '~/stores/auth-store';

import { InternalErrorUnauthenticated } from './internal-error/internal-error-unauthenticated';
import { NotFoundUnauthenticated } from './not-found/not-found-unauthenticated';

type RouterContext = {
  apolloClient: ApolloClient;
  preloadQuery: PreloadQueryFunction;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundUnauthenticated,
  errorComponent: InternalErrorUnauthenticated,
  beforeLoad: async () => {
    await verifyAuth();
    await hideSplashScreen();
    // This will be available in the context of all routes
    return {
      authenticated: authStore.getState().status === 'authenticated',
    };
  },
});

function RootComponent() {
  const router = useRouter();

  // Automatically reload the app if the user has been inactive for a long time
  // TODO: How to do this stale reloading with tanstack router?
  // useRouteStaleReloading();

  return (
    <AriaRouterProvider
      navigate={(to, options) => void router.navigate({ to, ...options })}
      useHref={to => router.buildLocation({ to }).href}
    >
      <Outlet />
      <RouterDevTools />
    </AriaRouterProvider>
  );
}

// Lazy load in development
const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(async () => {
        const devtools = await import('@tanstack/router-devtools').then(
          res => ({ default: res.TanStackRouterDevtools })
        );
        return devtools;
      });

function RouterDevTools() {
  return <TanStackRouterDevtools position="bottom-right" />;
}
