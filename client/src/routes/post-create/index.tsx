import { t } from '@lingui/macro';

import PostCreatePlaceholder from './PostCreatePlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import type { PageEntry } from '~types/navigation';

const PostCreate = loadableWithFallback(
  () => import('./PostCreate'),
  <PostCreatePlaceholder />
);
const PostCreatePageEntry: PageEntry = () => {
  useDocumentTitle(t`New blog post`);

  return <PostCreate />;
};

PostCreatePageEntry.preload = async () => {
  PostCreate.preload();
};

export default PostCreatePageEntry;
