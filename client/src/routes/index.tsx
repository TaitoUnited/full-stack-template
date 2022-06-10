import loadable from '@loadable/component';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { routes } from './route-entries';
import { RouteEntryProvider, renderRouteEntries } from './route-utils';
import { useAuthCheck } from '~services/auth';
import Page from '~components/navigation/Page';
import ProtectedRoute from '~components/navigation/ProtectedRoute';
import PageLayout from '~components/navigation/PageLayout';

const Login = loadable(() => import('./login'));
const NotFound = loadable(() => import('./not-found'));
const NotFoundAuthenticated = loadable(
  () => import('./not-found/index.authenticated')
);

export default function Router() {
  const authStatus = useAuthCheck();

  return (
    <RouteEntryProvider routes={routes}>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <PageLayout>
                <Outlet />
              </PageLayout>
            }
          >
            {renderRouteEntries(routes)}

            <Route
              path="*"
              element={
                <Page>
                  <NotFoundAuthenticated />
                </Page>
              }
            />
          </Route>
        </Route>

        <Route
          path="login"
          element={
            authStatus === 'authenticated' ? (
              <Navigate to="/" replace />
            ) : (
              <Page>
                <Login />
              </Page>
            )
          }
        />

        <Route
          path="*"
          element={
            <Page>
              <NotFound />
            </Page>
          }
        />
      </Routes>
    </RouteEntryProvider>
  );
}
