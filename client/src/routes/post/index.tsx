import { useParams } from 'react-router';

import type { Props as PostParams } from './Post';
import PostPlaceholder from './PostPlaceholder';
import Breadcrumbs from '~components/navigation/Breadcrumbs';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import { apolloClient, usePostQuery, PostDocument } from '~graphql';

const Post = loadableWithFallback<PostParams>(
  () => import('./Post'),
  <PostPlaceholder />
);

export default function PostContainer() {
  const { id } = useParams();
  const postQuery = usePostQuery({ variables: { id } });
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

// Preload component and data
PostContainer.preload = async (params: Record<string, any>) => {
  Post.preload();

  await apolloClient.query({
    query: PostDocument,
    variables: { id: params.id },
  });
};
