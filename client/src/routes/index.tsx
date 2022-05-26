import { Suspense } from 'react';
import loadable from '@loadable/component';
import { Routes, Route, Navigate } from 'react-router-dom';

// Don't code-split container pages since they load code and data in parallel
import Home from './home';
import PostList from './post-list';
import Post from './post';
import PostCreate from './post-create';
import Theming from './theming';
import Page from '~components/navigation/Page';
import ProtectedRoute from '~components/navigation/ProtectedRoute';
import { useAuthCheck } from '~services/auth';
import type { PageEntry } from '~types/navigation';

const Main = loadable(() => import('./Main'));
const Login = loadable(() => import('./login'));
const NotFound = loadable(() => import('./not-found'));
const NotFoundAuthenticated = loadable(
  () => import('./not-found/index.authenticated')
);

type Route = {
  path: string;
  component: PageEntry;
};

export const routes: Route[] = [
  { path: '/', component: Home },
  { path: '/blog', component: PostList },
  { path: '/blog/create', component: PostCreate },
  { path: '/blog/:id', component: Post },
  { path: '/theming', component: Theming },
];

export default function AppRoutes() {
  const authStatus = useAuthCheck();

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Main />
            </Suspense>
          }
        >
          {routes.map(({ path, component: PageComponent }) => (
            <Route
              key={path}
              path={path}
              element={
                <Page fallback={null}>
                  <PageComponent />
                </Page>
              }
            />
          ))}

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
  );
}
