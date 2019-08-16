import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '~common/ui';

// Code split routes
const Posts = React.lazy(() => import('./blog'));
const Settings = React.lazy(() => import('./settings'));

const Router = () => (
  <React.Suspense fallback="Loading...">
    <Route
      path="/posts"
      render={(navProps: any) => (
        <ErrorBoundary>
          <Posts {...navProps} />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/settings"
      render={(navProps: any) => (
        <ErrorBoundary>
          <Settings {...navProps} />
        </ErrorBoundary>
      )}
    />
  </React.Suspense>
);

export default Router;
