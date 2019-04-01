import React from 'react';
import { Route } from 'react-router-dom';

// Code split routes
const Images = React.lazy(() => import('./images'));
const Posts = React.lazy(() => import('./posts'));
const Reports = React.lazy(() => import('./reports'));

const Router = () => (
  <React.Suspense fallback="Loading...">
    <Route path="/images" render={navProps => <Images {...navProps} />} />
    <Route path="/posts" render={navProps => <Posts {...navProps} />} />
    <Route path="/reports" render={navProps => <Reports {...navProps} />} />
  </React.Suspense>
);

export default Router;
