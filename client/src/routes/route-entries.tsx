import type { RouteEntries } from './route-utils';

import homeEntry from './home';
import postListEntry from './post-list';
import postEntry from './post';
import postCreateEntry from './post-create';
import themingEntry from './theming';

export const routes: RouteEntries = [
  { path: '/', entry: homeEntry },
  { path: '/blog', entry: postListEntry },
  { path: '/blog/create', entry: postCreateEntry },
  { path: '/blog/:id', entry: postEntry },
  { path: '/theming', entry: themingEntry },
];
