import type { RouteEntries } from './route-utils';

import home from './home';
import post from './post';
import postList from './post-list';
import postCreate from './post-create';
import theming from './theming';
import featureFlags from './feature-flags';

// NOTE: the `path` that used to match the route is defined here!
// There is also a `path` defined in the entry itself which is used to provide
// type safety for the path params used in the loader function.

export const routes = [
  {
    path: '/',
    entry: home,
  },
  {
    path: '/blog',
    entry: postList,
    children: [{ path: 'create', entry: postCreate }],
  },
  {
    path: '/blog/:id',
    entry: post,
  },
  {
    path: '/theming',
    entry: theming,
  },
  {
    path: '/feature-flags',
    entry: featureFlags,
  },
] satisfies RouteEntries;
