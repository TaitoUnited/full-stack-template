import { useParams } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import PostDetails from '~components/post/PostDetails';
import Breadcrumbs from '~components/navigation/Breadcrumbs';
import { useDocumentTitle } from '~utils/routing';
import { usePostQuery } from '~graphql';
import { Text } from '~uikit';
import { css } from '~styled-system/css';

export default function PostPage() {
  const { id = '' } = useParams();
  const { data, error } = usePostQuery({ variables: { id } });
  const post = data?.post;
  const postSubject = post?.subject ?? '';

  useDocumentTitle(postSubject);

  return (
    <div className={css({ flex: 1 })}>
      <Breadcrumbs>
        <Breadcrumbs.Link to={`/blog`}>Blog</Breadcrumbs.Link>
        <Breadcrumbs.Link>{postSubject}</Breadcrumbs.Link>
      </Breadcrumbs>

      {post ? (
        <PostDetails
          createdAt={post.createdAt}
          author={post.author || ''}
          subject={post.subject || ''}
          content={post.content || ''}
        />
      ) : (
        <Text variant="body">
          <Trans>Could not find post.</Trans>
        </Text>
      )}

      {!!error && (
        <Text variant="body">
          <Trans>Failed to load blog post.</Trans>
        </Text>
      )}
    </div>
  );
}
