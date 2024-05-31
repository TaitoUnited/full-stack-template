import { useState } from 'react';
import { t, Trans } from '@lingui/macro';
import { Outlet, useNavigate } from 'react-router-dom';

import { UnstyledLink } from '~components/navigation/Link';
import { useDocumentTitle } from '~hooks/useDocumentTitle';
import { stack } from '~styled-system/patterns';
import { Text, Stack, Button, Select } from '~uikit';
import { OrderDirection, usePostListSuspenseQuery } from '~graphql';
import { PostListCard } from '~components/post/PostListCard';
import { css } from '~styled-system/css';

export default function PostListRoute() {
  const navigate = useNavigate();

  // TODO: add sort to URL params
  const [sort, setSort] = useState(OrderDirection.Desc);

  const { data, suspending } = usePostListSuspenseQuery({
    variables: { order: { field: 'createdAt', dir: sort } },
  });

  const posts = data.posts.data;

  useDocumentTitle(t`Blog`);

  return (
    <>
      <Stack direction="column" gap="large">
        <Text variant="headingXl">
          <Trans>Blog</Trans>
        </Text>

        <div className={css({ maxWidth: '200px' })}>
          <Select
            label={t`Sort by`}
            selectedKey={sort}
            onSelectionChange={s => setSort(s as OrderDirection)}
            items={[
              { label: t`Newest`, value: OrderDirection.Desc },
              { label: t`Oldest`, value: OrderDirection.Asc },
            ]}
          />
        </div>

        {suspending && <Text variant="body">Loading...</Text>}

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

        <div>
          <Button
            color="primary"
            variant="filled"
            icon="pen"
            data-test-id="navigate-to-create-post"
            onPress={() => navigate('create')}
          >
            <Trans>New post</Trans>
          </Button>
        </div>
      </Stack>

      {/* Render child "create" route (in dialog) */}
      <Outlet />
    </>
  );
}
