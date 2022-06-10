import Fallback from './Post.fallback';
import { routeEntry } from '../route-utils';
import { query, PostDocument } from '~graphql';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./Post.page'),
  loader: ({ id }) => query(PostDocument, { id }).then(res => res.data),
});
