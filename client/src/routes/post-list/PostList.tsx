import styled from 'styled-components';
import { HiPencil } from 'react-icons/hi';
import { Trans } from '@lingui/macro';
import { orderBy } from 'lodash';

import PostListPlaceholder from './PostListPlaceholder';
import PostListCard from '~components/post/PostListCard';
import { UnstyledLink } from '~components/navigation/Link';
import { Text, Stack, FloatingButton } from '~uikit';
import type { PostListQueryHookResult } from '~graphql';

export type Props = {
  postListQuery: PostListQueryHookResult;
};

export default function PostListPage({ postListQuery }: Props) {
  const { data, loading, error } = postListQuery;

  if (loading) {
    return <PostListPlaceholder />;
  }

  const posts = orderBy(data?.posts.data ?? [], 'createdAt', 'desc');

  return (
    <Stack axis="y" spacing="large">
      <Text variant="title1">
        <Trans>Blog</Trans>
      </Text>

      {posts.length > 0 ? (
        <Stack as="ul" axis="y" spacing="normal">
          {posts.map(post => (
            <li key={post.id}>
              <UnstyledLink to={post.id} preloadMethod="click">
                <PostListCard
                  createdAt={post.createdAt}
                  subject={post.subject}
                />
              </UnstyledLink>
            </li>
          ))}
        </Stack>
      ) : (
        <Text variant="body">No blog posts.</Text>
      )}

      {!!error && <Text variant="body">Failed to load blog posts.</Text>}

      <NewPostButton>
        <FloatingButton
          variant="primary"
          icon={HiPencil}
          label="New post"
          {...({ as: UnstyledLink, to: 'create' } as any)}
        />
      </NewPostButton>
    </Stack>
  );
}

const NewPostButton = styled.div`
  position: fixed;
  bottom: ${p => p.theme.spacing.medium}px;
  right: ${p => p.theme.spacing.medium}px;
`;
