import loadable from '@loadable/component';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import {
  RouteEntry,
  RouteEntryProvider,
  renderRouteEntries,
} from './route-utils';

// Don't code-split route entries since they load code and data in parallel
import homeEntry from './home';
import postListEntry from './post-list';
import postEntry from './post';
import postCreateEntry from './post-create';
import themingEntry from './theming';

import Page from '~components/navigation/Page';
import ProtectedRoute from '~components/navigation/ProtectedRoute';
import { useAuthCheck } from '~services/auth';
import PageLayout from '~components/navigation/PageLayout';

const Login = loadable(() => import('./login'));
const NotFound = loadable(() => import('./not-found'));
const NotFoundAuthenticated = loadable(
  () => import('./not-found/index.authenticated')
);

const routes: RouteEntry[] = [
  { path: '/', entry: homeEntry },
  { path: '/blog', entry: postListEntry },
  { path: '/blog/create', entry: postCreateEntry },
  { path: '/blog/:id', entry: postEntry },
  { path: '/theming', entry: themingEntry },
];

export default function AppRoutes() {
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
