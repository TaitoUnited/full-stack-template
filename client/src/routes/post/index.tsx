import Fallback from './Post.fallback';
import { routeEntry } from '../route-utils';

import {
  query,
  PostDocument,
  PostQueryResult,
  PostQueryVariables,
} from '~graphql';

export default routeEntry({
  path: '/blog/:id',
  fallback: <Fallback />,
  component: () => import('./Post.page'),
  loader: ({ id }) =>
    query<PostQueryResult, PostQueryVariables>(PostDocument, { id }).then(
      res => res.data
    ),
});
