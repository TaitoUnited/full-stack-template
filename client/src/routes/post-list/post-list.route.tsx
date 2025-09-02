import { Trans, useLingui } from '@lingui/react/macro';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { DocumentTitle } from '~/components/common/document-title';
import { Link } from '~/components/navigation/link';
import { LinkButton } from '~/components/uikit/button';
import { useReadQuery } from '~/graphql';
import { PostListQuery } from '~/graphql/post/queries';
import { stack } from '~/styled-system/patterns';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

import { PostListCard } from './post-list-card';

export const Route = createFileRoute('/_app/$workspaceId/posts')({
  component: PostListRoute,
  loader: async ({ context }) => ({
    queryRef: context.preloadQuery(PostListQuery),
  }),
});

export default function PostListRoute() {
  const { t } = useLingui();
  const { queryRef } = Route.useLoaderData();
  const {
    data: { posts },
  } = useReadQuery(queryRef);

  return (
    <>
      <DocumentTitle title={t`Blog`} />

      <Stack direction="column" gap="$large">
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

        {/* {suspending && <Text variant="body">Loading...</Text>} TODO: enable loading */}

        {posts.length > 0 ? (
          <ul
            className={stack({ gap: '$regular', alignItems: 'stretch' })}
            data-testid="post-list"
          >
            {posts.map(post => (
              <li key={post.id}>
                <Link to={post.id}>
                  <PostListCard
                    createdAt={post.createdAt}
                    title={post.title || ''}
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Text variant="body">No blog posts.</Text>
        )}

        <div>
          <LinkButton
            to="/$workspaceId/posts/create"
            variant="filled"
            icon="add"
            data-testid="post-create-link"
          >
            <Trans>New post</Trans>
          </LinkButton>
        </div>
      </Stack>

      {/* Render child "create" route (in dialog) */}
      <Outlet />
    </>
  );
}
