import { Trans } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

import { Breadcrumbs } from '~/components/navigation/breadcrumbs';
import { type ResultOf, useReadQuery } from '~/graphql';
import { PostQuery } from '~/graphql/post/queries';
import { useDocumentTitle } from '~/hooks/use-document-title';
import { RouteError } from '~/routes/route-error';
import { RouteSpinner } from '~/routes/route-spinner';
import { css } from '~/styled-system/css';

import { PostDetails } from './post-details';

export const Route = createFileRoute('/_app/$workspaceId/posts_/$id')({
  component: PostRoute,
  errorComponent: () => <RouteError />,
  pendingComponent: () => <RouteSpinner />,
  loader: async ({ context, params }) => ({
    postQueryRef: context.preloadQuery(PostQuery, {
      variables: { id: params.id },
    }),
  }),
});
export default function PostRoute() {
  const { postQueryRef } = Route.useLoaderData();
  const { post } = useReadQuery(postQueryRef).data;

  if (!post) {
    // TODO: implement a 404 page
    return null;
  }

  return <PostPage post={post} />;
}

function PostPage({
  post,
}: {
  post: NonNullable<ResultOf<typeof PostQuery>['post']>;
}) {
  useDocumentTitle(post.title);

  return (
    <div className={css({ flex: 1 })}>
      <Breadcrumbs>
        <Breadcrumbs.Item to="/$workspaceId/posts">
          <Trans>Blog</Trans>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{post.title}</Breadcrumbs.Item>
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
