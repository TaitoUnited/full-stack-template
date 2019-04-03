import React from 'react';
import { Route } from 'react-router-dom';

// Code split routes
const Orders = React.lazy(() => import('./orders'));
const Posts = React.lazy(() => import('./posts'));
const Reports = React.lazy(() => import('./reports'));
const Settings = React.lazy(() => import('./settings'));

const Router = () => (
  <React.Suspense fallback="Loading...">
    <Route path="/orders" render={navProps => <Orders {...navProps} />} />
    <Route path="/posts" render={navProps => <Posts {...navProps} />} />
    <Route path="/reports" render={navProps => <Reports {...navProps} />} />
    <Route path="/settings" render={navProps => <Settings {...navProps} />} />
  </React.Suspense>
);

export default Router;
