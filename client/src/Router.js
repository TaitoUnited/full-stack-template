import React from 'react';
import { Route } from 'react-router-dom';

import { withErrorBoundary } from '~infra/ErrorBoundary';

import Images from './images';
import Layouts from './layouts';
import Posts from './posts';
import Reports from './reports';

// TODO move these definitions ./search
import ImageSearch from './search/images';
import PostSearch from './search/posts';
import PostBrowseResults from './search/posts/BrowseResultsPage';

const Router = () => (
  <div>
    <Route path='/images' component={withErrorBoundary(Images)} />
    <Route path='/layouts' component={withErrorBoundary(Layouts)} />
    <Route path='/posts' component={withErrorBoundary(Posts)} />
    <Route path='/reports' component={withErrorBoundary(Reports)} />
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
