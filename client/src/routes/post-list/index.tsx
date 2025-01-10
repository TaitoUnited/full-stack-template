import { Trans, useLingui } from '@lingui/react/macro';
import { Outlet, useNavigate } from 'react-router-dom';

import { PostListCard } from './PostListCard';
import { UnstyledLink } from '~components/navigation/Link';
import { useDocumentTitle } from '~hooks/useDocumentTitle';
import { stack } from '~styled-system/patterns';
import { Text, Stack, Button } from '~uikit';
import { usePostListSuspenseQuery } from '~graphql';

export default function PostListRoute() {
  const { t } = useLingui();
  const navigate = useNavigate();
  const { data, suspending } = usePostListSuspenseQuery();
  const { posts } = data;

  useDocumentTitle(t`Blog`);

  return (
    <>
      <Stack direction="column" gap="large">
        <Text variant="headingXl">
          <Trans>Blog</Trans>
        </Text>

        {/* TODO: enable ordering */}
        {/* <div className={css({ maxWidth: '200px' })}>
          <Select
            label={t`Sort by`}
            selectedKey={sort}
            onSelectionChange={s => setSort(s as OrderDirection)}
            items={[
              { label: t`Newest`, value: OrderDirection.Desc },
              { label: t`Oldest`, value: OrderDirection.Asc },
            ]}
          />
        </div> */}

        {suspending && <Text variant="body">Loading...</Text>}

        {posts.length > 0 ? (
          <ul
            className={stack({ gap: '$regular', alignItems: 'stretch' })}
            data-testid="post-list"
          >
            {posts.map(post => (
              <li key={post.id}>
                <UnstyledLink to={post.id}>
                  <PostListCard
                    createdAt={post.createdAt}
                    title={post.title || ''}
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
            data-testid="navigate-to-create-post"
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
