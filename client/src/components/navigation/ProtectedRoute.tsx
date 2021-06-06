import type { ReactElement, ReactNode } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { useAuth } from '~services/auth';

type Props = {
  path: string;
  element: ReactElement;
  children: ReactNode;
};

export default function ProtectedRoute({ element, path, children }: Props) {
  const { status } = useAuth();

  if (status === 'undetermined' || status === 'determining') {
    return null;
  }

  return status === 'authenticated' || status === 'logging-out' ? (
    <Route path={path} element={element}>
      {children}
    </Route>
  ) : (
    <Navigate to={'/login'} replace={true} />
  );
}
