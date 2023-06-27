import styled from 'styled-components';
import { t, Trans } from '@lingui/macro';
import { Outlet } from 'react-router-dom';

import type { LoaderData } from '.';
import { UnstyledLink } from '~components/navigation/Link';
import { useDocumentTitle } from '~utils/routing';
import { Text, Stack, FloatingButton } from '~uikit';
import { OrderDirection, usePostListQuery } from '~graphql';
import PostListCard from '~components/post/PostListCard';

type Props = {
  loaderData: LoaderData;
};

export default function PostListPage({ loaderData }: Props) {
  const { data, error } = usePostListQuery({
    variables: {
      order: { field: 'createdAt', dir: OrderDirection.Desc },
    },
  });

  const posts = data?.posts.data ?? loaderData.data?.posts.data ?? [];

  useDocumentTitle(t`Blog`);

  return (
    <>
      <Stack axis="y" spacing="large">
        <Text variant="title1">
          <Trans>Blog</Trans>
        </Text>

        {posts.length > 0 ? (
          <Stack as="ul" axis="y" spacing="normal" data-test-id="post-list">
            {posts.map(post => (
              <li key={post.id}>
                <UnstyledLink to={post.id}>
                  <PostListCard
                    createdAt={post.createdAt}
                    subject={post.subject || ''}
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
            icon="pencil"
            label="New post"
            data-test-id="navigate-to-create-post"
            asLink={{ to: 'create', preloadOn: 'hover' }}
          />
        </NewPostButton>
      </Stack>

      <Outlet />
    </>
  );
}

const NewPostButton = styled.div`
  position: fixed;
  bottom: ${p => p.theme.spacing.medium}px;
  right: ${p => p.theme.spacing.medium}px;
`;
