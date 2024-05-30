import { useParams } from 'react-router-dom';

import { PostDetails } from '~components/post/PostDetails';
import { Breadcrumbs } from '~components/navigation/Breadcrumbs';
import { useDocumentTitle } from '~utils/document';
import { usePostSuspenseQuery } from '~graphql';
import { css } from '~styled-system/css';

export default function PostRoute() {
  const { id = '' } = useParams();
  const { data } = usePostSuspenseQuery({ variables: { id } });
  const { post } = data;

  useDocumentTitle(post.subject);

  return (
    <div className={css({ flex: 1 })}>
      <Breadcrumbs>
        <Breadcrumbs.Link to="/blog">Blog</Breadcrumbs.Link>
        <Breadcrumbs.Link>{post.subject}</Breadcrumbs.Link>
      </Breadcrumbs>

      <PostDetails
        createdAt={post.createdAt}
        author={post.author}
        subject={post.subject}
        content={post.content}
      />
    </div>
  );
}
