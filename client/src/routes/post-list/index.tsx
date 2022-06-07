import Fallback from './PostListPlaceholder';
import { routeEntry } from '../route-utils';
import { query, PostListDocument } from '~graphql';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./PostList'),
  loader: () => query(PostListDocument).then(res => res.data),
});
