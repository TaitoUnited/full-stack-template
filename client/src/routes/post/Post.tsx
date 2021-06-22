import styled from 'styled-components';
import { Trans } from '@lingui/macro';

import PostPlaceholder from './PostPlaceholder';
import PostDetails from '~components/post/PostDetails';
import { Text } from '~uikit';
import type { PostQueryHookResult } from '~graphql';

export type Props = {
  postQuery: PostQueryHookResult;
};

export default function PostPage({ postQuery }: Props) {
  const { data, loading, error } = postQuery;

  if (loading) {
    return <PostPlaceholder />;
  }

  const post = data?.post;

  return (
    <Wrapper>
      {post ? (
        <PostDetails
          createdAt={post.createdAt}
          author={post.author}
          subject={post.subject}
          content={post.content}
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
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;
`;
