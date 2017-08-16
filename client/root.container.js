import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Lazy-load helper
import LoadComponent from '~core-components/load.component';

// Lazy-load a component tree so that webpack can split code bundle in chuncks
// Just ignore lint error caused by webpack dynamic import
/* eslint-disable */
const ExamplesContainer = LoadComponent({
  loader: () => import(
    /* webpackChunkName: "vanilla-container" */
    './examples/examples.container'
  ),
});
/* eslint-enable */

const Root = () => (
  <BrowserRouter>
    <ExamplesContainer />
  </BrowserRouter>
);

export default Root;
