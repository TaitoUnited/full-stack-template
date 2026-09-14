import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { PageLayout } from '~/components/common/page-layout';

import { InternalErrorAuthenticated } from './internal-error/internal-error-authenticated';
import { NotFoundAuthenticated } from './not-found/not-found-authenticated';

export const Route = createFileRoute('/_app')({
  component: Layout,
  errorComponent: InternalErrorAuthenticated,
  notFoundComponent: NotFoundAuthenticated,
  beforeLoad: ({ context }) => {
    if (!context.authenticated) {
      redirect({ to: '/login', throw: true });
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
