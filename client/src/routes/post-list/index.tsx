import Fallback from './PostList.fallback';
import { routeEntry, RouteEntryLoaderData } from '../route-utils';

import {
  query,
  PostListDocument,
  PostListQueryResult,
  OrderDirection,
} from '~graphql';

const entry = routeEntry({
  path: '/blog',
  fallback: <Fallback />,
  component: () => import('./PostList.page'),
  loader: () =>
    query<PostListQueryResult>(PostListDocument, {
      order: { field: 'createdAt', dir: OrderDirection.Desc },
    }).then(res => res.data),
});

export type LoaderData = RouteEntryLoaderData<typeof entry>;

export default entry;
