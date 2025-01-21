import { createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { RootRoute } from './RootRoute';
import { RouteError } from './RouteError';
import { lazyRoute } from './router-utils';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: 'login',
        ...lazyRoute(() => import('./login')),
      },
      {
        path: '/',
        element: <ProtectedRoute />, // this contains the app layout
        children: [
          {
            index: true,
            ...lazyRoute(() => import('./home')),
          },
          {
            path: 'blog',
            ...lazyRoute(() => import('./post-list')),
            children: [
              {
                path: 'create',
                ...lazyRoute(() => import('./post-create')),
              },
            ],
          },
          {
            path: 'blog/:id',
            ...lazyRoute(() => import('./post')),
          },
          {
            path: 'theming',
            ...lazyRoute(() => import('./theming')),
          },
          // This catch-all route is rendered if none of the above routes match
          {
            path: '*',
            ...lazyRoute(() => import('./not-found/authenticated')),
          },
        ],
      },
      // This catch-all route is rendered if none of the above routes match
      {
        path: '*',
        ...lazyRoute(() => import('./not-found/unauthenticated')),
      },
    ],
  },
]);
