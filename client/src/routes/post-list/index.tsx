import { t, Trans } from '@lingui/macro';
import { Outlet, useNavigate } from 'react-router-dom';

import { UnstyledLink } from '~components/navigation/Link';
import { useDocumentTitle } from '~utils/document';
import { stack } from '~styled-system/patterns';
import { Text, Stack, Button } from '~uikit';
import { OrderDirection, usePostListQuery } from '~graphql';
import { PostListCard } from '~components/post/PostListCard';

export default function PostListRoute() {
  const navigate = useNavigate();
  const { data, error } = usePostListQuery({
    variables: {
      order: { field: 'createdAt', dir: OrderDirection.Desc },
    },
  });

  const posts = data?.posts.data ?? [];

  useDocumentTitle(t`Blog`);

  return (
    <>
      <Stack direction="column" gap="large">
        <Text variant="headingXl">
          <Trans>Blog</Trans>
        </Text>

        {posts.length > 0 ? (
          <ul
            className={stack({ gap: '$regular', alignItems: 'stretch' })}
            data-test-id="post-list"
          >
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
          </ul>
        ) : (
          <Text variant="body">No blog posts.</Text>
        )}

        {!!error && <Text variant="body">Failed to load blog posts.</Text>}

        <div>
          <Button
            color="primary"
            variant="outlined"
            icon="pen"
            data-test-id="navigate-to-create-post"
            onPress={() => navigate('create')}
          >
            <Trans>New post</Trans>
          </Button>
        </div>
      </Stack>

      <Outlet />
    </>
  );
}
