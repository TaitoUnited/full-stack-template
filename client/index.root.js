import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import LazyLoadHandler from './app/common/lazyLoad.handler';

/* eslint-disable */
const AppContainer = LazyLoadHandler({
  loader: () => import(
    /* webpackChunkName: "vanilla-container" */
    './app/app.container'
  ),
});
/* eslint-enable */

const Root = () => (
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>
);

export default Root;
