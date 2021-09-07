import { t } from '@lingui/macro';

import type { Props as PostListProps } from './PostList';
import PostListPlaceholder from './PostListPlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';

import {
  preloadQuery,
  PreloadHandler,
  PostListDocument,
  usePostListQuery,
} from '~graphql';

const PostList = loadableWithFallback<PostListProps>(
  () => import('./PostList'),
  <PostListPlaceholder />
);

export default function PostListContainer() {
  const postListQuery = usePostListQuery();

  useDocumentTitle(t`Blog`);

  return <PostList postListQuery={postListQuery} />;
}

PostListContainer.preload = (async (_, trigger) => {
  PostList.preload();

  if (trigger === 'click') {
    await preloadQuery(PostListDocument);
  }
}) as PreloadHandler;
