import { t } from '@lingui/macro';

import PostCreatePlaceholder from './PostCreatePlaceholder';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';

const PostCreate = loadableWithFallback(
  () => import('./PostCreate'),
  <PostCreatePlaceholder />
);

export default function PostCreateContainer() {
  useDocumentTitle(t`New blog post`);

  return <PostCreate />;
}

// Preload component and data
PostCreateContainer.preload = () => {
  PostCreate.preload();
};
