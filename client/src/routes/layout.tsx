import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { PageLayout } from '~/components/common/page-layout';
import { OrganisationsQuery } from '~/graphql/organisation/queries';
import { logout } from '~/stores/auth-store';
import { workspaceIdStore } from '~/stores/workspace-store';

/**
 * Root layout is responsible for redirecting the user to the login page if
 * they are not authenticated and for selecting the current workspace before
 * rendering the app.
 */
export const Route = createFileRoute('/_app')({
  component: Layout,
  beforeLoad: async ({ context, params }) => {
    if (!context.authenticated) {
      throw redirect({ to: '/login' });
    }

    /**
     * Note: root layout is run on every navigation so we don't want to fetch
     * the workspaces every time but instead read them from the cache.
     */
    const { data } = await context.apolloClient.query({
      query: OrganisationsQuery,
      fetchPolicy: 'cache-first',
    });

    // Select the current workspace before rendering the app
    const workspaces = data.organisations;
    const workspaceIdStored = workspaceIdStore.getState().workspaceId;
    const workspaceIdParam = (params as any).workspaceId;
    const workspaceIdFallback = workspaces?.[0]?.id;
    const workspaceId = workspaces?.find(w => w.id === workspaceIdParam)?.id;

    /**
     * If no matching workspace was found and the user has no workspaces,
     * logout and redirect to the login page.
     */
    if (!workspaceId && !workspaceIdFallback) {
      await logout();
      workspaceIdStore.setState({ workspaceId: '' });
      throw redirect({ to: '/login' });
    } else if (!workspaceId) {
      /**
       * If workspace from URL params was not found but the user has workspaces,
       * redirect to the first workspace as a fallback.
       */
      workspaceIdStore.setState({ workspaceId: workspaceIdFallback });
      throw redirect({ to: `/${workspaceIdFallback}` });
    } else if (workspaceId !== workspaceIdStored) {
      /**
       * Otherwise if the workspace from URL params is different from
       * the stored one, update the stored workspace.
       */
      workspaceIdStore.setState({ workspaceId });
    } else {
      /**
       * If the workspace from URL params is the same as the stored one,
       * do nothing and continue rendering the route tree.
       */
    }
  },
});
function Layout() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
