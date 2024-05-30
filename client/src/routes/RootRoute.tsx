import { RouterProvider as AriaRouterProvider } from 'react-aria-components';
import { Outlet, useNavigate } from 'react-router-dom';

import { useRoutePreloading, useRouteStaleReloading } from './router-utils';

/**
 * Due to the way React Router v6 defines routes with `createBrowserRouter` and
 * `RouterProvider` we need to create this root route in order to be able to
 * render the `AriaRouterProvider` inside the `RouterProvider` from React Router
 * so that it has access to the `useNavigate` hook.
 *
 * The `AriaRouterProvider` is needed to have links inside Miranda components
 * work correctly with React Router.
 * See: https://react-spectrum.adobe.com/react-aria/routing.html
 */
export function RootRoute() {
  const navigate = useNavigate();

  // Automatically preload routes for links with `data-preload` attribute
  useRoutePreloading();

  // Automatically reload the app if the user has been inactive for a long time
  useRouteStaleReloading();

  return (
    <AriaRouterProvider navigate={navigate}>
      <Outlet />
    </AriaRouterProvider>
  );
}
