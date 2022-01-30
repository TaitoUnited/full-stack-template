import { useParams } from 'react-router';

import type { Props as PostParams } from './Post';
import PostPlaceholder from './PostPlaceholder';
import Breadcrumbs from '~components/navigation/Breadcrumbs';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';

import {
  preloadQuery,
  usePostQuery,
  PostDocument,
  PreloadHandler,
} from '~graphql';

const Post = loadableWithFallback<PostParams>(
  () => import('./Post'),
  <PostPlaceholder />
);

export default function PostContainer() {
  const { id } = useParams();
  const postQuery = usePostQuery({ variables: { id: id || '' } });
  const postSubject = postQuery.data?.post?.subject ?? '';

  useDocumentTitle(postSubject);

  return (
    <>
      <Breadcrumbs>
        <Breadcrumbs.Link to={`/blog`}>Blog</Breadcrumbs.Link>
        <Breadcrumbs.Link>{postSubject}</Breadcrumbs.Link>
      </Breadcrumbs>

      <Post postQuery={postQuery} />
    </>
  );
}

PostContainer.preload = (async (params, trigger) => {
  Post.preload();

  if (trigger === 'click') {
    await preloadQuery(PostDocument, { id: params?.id });
  }
}) as PreloadHandler;
