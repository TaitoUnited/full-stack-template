import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~services/auth';

export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === 'undetermined' || status === 'determining') {
    return null;
  }

  return status === 'authenticated' || status === 'logging-out' ? (
    <Outlet />
  ) : (
    <Navigate to={'/login'} replace={true} />
  );
}
