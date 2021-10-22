import { t } from '@lingui/macro';

import type { Props as PostListProps } from './PostList';
import PostListPlaceholder from './PostListPlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import { preloadQuery, PostListDocument, usePostListQuery } from '~graphql';
import type { PageEntry } from '~types/navigation';

const PostList = loadableWithFallback<PostListProps>(
  () => import('./PostList'),
  <PostListPlaceholder />
);

const PostListPageEntry: PageEntry = () => {
  const postListQuery = usePostListQuery();

  useDocumentTitle(t`Blog`);

  return <PostList postListQuery={postListQuery} />;
};

PostListPageEntry.preload = async (_, trigger) => {
  PostList.preload();

  if (trigger === 'click') {
    await preloadQuery(PostListDocument);
  }
};

export default PostListPageEntry;
