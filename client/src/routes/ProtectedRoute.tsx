import { Navigate, Outlet } from 'react-router-dom';

import { PageLayout } from '~components/common/PageLayout';
import { useAuth } from '~services/auth';

export function ProtectedRoute() {
  const { status } = useAuth();

  if (status === 'undetermined' || status === 'determining') {
    return null;
  }

  return status === 'authenticated' || status === 'logging-out' ? (
    <PageLayout>
      <Outlet />
    </PageLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}
