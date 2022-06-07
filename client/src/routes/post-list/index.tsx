import Fallback from './PostList.fallback';
import { routeEntry } from '../route-utils';
import { query, PostListDocument } from '~graphql';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./PostList.page'),
  loader: () => query(PostListDocument).then(res => res.data),
});
