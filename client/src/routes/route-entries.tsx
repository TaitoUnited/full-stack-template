import type { RouteEntries } from './route-utils';

import home from './home';
import post from './post';
import postList from './post-list';
import postCreate from './post-create';
import theming from './theming';

// NOTE: the path for each route is defined here again in order to have a single
// source of truth for all routes and visually see the structure of the app.

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
] satisfies RouteEntries;
