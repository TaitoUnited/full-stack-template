import Fallback from './PostPlaceholder';
import { routeEntry } from '../route-utils';
import { query, PostDocument } from '~graphql';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./Post'),
  loader: ({ id = '' }) => query(PostDocument, { id }).then(res => res.data),
});
