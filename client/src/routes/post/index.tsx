import { useParams } from 'react-router-dom';

import { PostDetails } from './PostDetails';
import { Breadcrumbs } from '~components/navigation/Breadcrumbs';
import { useDocumentTitle } from '~hooks/useDocumentTitle';
import { usePostSuspenseQuery, PostQuery } from '~graphql';
import { css } from '~styled-system/css';

export default function PostRoute() {
  const { id = '' } = useParams();
  const { data } = usePostSuspenseQuery({ variables: { id } });
  const { post } = data;

  if (!post) {
    // TODO: implement a 404 page
    return null;
  }

  return <PostPage post={post} />;
}

function PostPage({ post }: { post: NonNullable<PostQuery['post']> }) {
  useDocumentTitle(post.title);

  return (
    <div className={css({ flex: 1 })}>
      <Breadcrumbs>
        <Breadcrumbs.Link to="/blog">Blog</Breadcrumbs.Link>
        <Breadcrumbs.Link>{post.title}</Breadcrumbs.Link>
      </Breadcrumbs>

      <PostDetails
        createdAt={post.createdAt}
        author={post.author?.name ?? 'Unknown'}
        subject={post.title}
        content={post.content}
      />
    </div>
  );
}
