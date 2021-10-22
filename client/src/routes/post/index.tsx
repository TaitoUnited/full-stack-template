import { useParams } from 'react-router';

import type { Props as PostProps } from './Post';
import PostPlaceholder from './PostPlaceholder';
import Breadcrumbs from '~components/navigation/Breadcrumbs';
import { loadableWithFallback } from '~utils/promise';
import { useDocumentTitle } from '~utils/routing';
import { preloadQuery, usePostQuery, PostDocument } from '~graphql';
import type { PageEntry } from '~types/navigation';

const Post = loadableWithFallback<PostProps>(
  () => import('./Post'),
  <PostPlaceholder />
);

const PostPageEntry: PageEntry = () => {
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
};

PostPageEntry.preload = async (params, trigger) => {
  Post.preload();

  if (trigger === 'click') {
    await preloadQuery(PostDocument, { id: params?.id });
  }
};

export default PostPageEntry;
