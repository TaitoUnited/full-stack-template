import React from 'react';
import { Route } from 'react-router-dom';

import { withErrorBoundary } from '~infra/ErrorBoundary';

import ImageSearch from './images';
import PostSearch from './posts';
import PostBrowseResults from './posts/BrowseResultsPage';

const Router = () => (
  <div>
    <Route
      exact
      path='/search/images'
      component={withErrorBoundary(ImageSearch)}
    />
    <Route
      exact
      path='/search/posts'
      component={withErrorBoundary(PostSearch)}
    />
    <Route
      exact
      path='/search/posts/browse'
      component={withErrorBoundary(PostBrowseResults)}
    />
  </div>
);

export default Router;
