import Fallback from './Post.fallback';
import { routeEntry } from '../route-utils';

import {
  query,
  PostDocument,
  PostQueryResult,
  PostQueryVariables,
} from '~graphql';

export default routeEntry({
  fallback: <Fallback />,
  component: () => import('./Post.page'),
  loader: ({ id }: { id: string }) =>
    query<PostQueryResult, PostQueryVariables>(PostDocument, { id }).then(
      res => res.data
    ),
});
