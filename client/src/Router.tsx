import React from 'react';
import { Route } from 'react-router-dom';
import { ErrorBoundary } from '~common/ui';

// Code split routes
const Orders = React.lazy(() => import('./orders'));
const Posts = React.lazy(() => import('./posts'));
const Reports = React.lazy(() => import('./reports'));
const Settings = React.lazy(() => import('./settings'));

const Router = () => (
  <React.Suspense fallback="Loading...">
    <Route
      path="/orders"
      render={navProps => (
        <ErrorBoundary>
          <Orders {...navProps} />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/posts"
      render={navProps => (
        <ErrorBoundary>
          <Posts {...navProps} />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/reports"
      render={navProps => (
        <ErrorBoundary>
          <Reports {...navProps} />
        </ErrorBoundary>
      )}
    />
    <Route
      path="/settings"
      render={navProps => (
        <ErrorBoundary>
          <Settings {...navProps} />
        </ErrorBoundary>
      )}
    />
  </React.Suspense>
);

export default Router;
