import Fallback from './PostList.fallback';
import { routeEntry, RouteEntryLoaderData } from '../route-utils';
import { query, PostListDocument, PostListQueryResult } from '~graphql';

const entry = routeEntry({
  fallback: <Fallback />,
  component: () => import('./PostList.page'),
  loader: () =>
    query<PostListQueryResult>(PostListDocument).then(res => res.data),
});

export type LoaderData = RouteEntryLoaderData<typeof entry>;

export default entry;
