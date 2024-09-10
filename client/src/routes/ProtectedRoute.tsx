import { Navigate, Outlet } from 'react-router-dom';

import { PageLayout } from '~components/common/PageLayout';
import { useAuthStore } from '~services/auth';

export function ProtectedRoute() {
  const authStatus = useAuthStore(state => state.status);

  if (authStatus === 'undetermined' || authStatus === 'determining') {
    return null;
  }

  return authStatus === 'authenticated' || authStatus === 'logging-out' ? (
    <PageLayout>
      <Outlet />
    </PageLayout>
  ) : (
    <Navigate to="/login" replace />
  );
}
