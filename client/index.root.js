import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import LazyLoadHandler from '~infra/lazyLoad.handler';

/* eslint-disable */
// TODO chunks
const App = LazyLoadHandler({
  loader: () =>
    import(/* webpackChunkName: "vanilla-container" */
    './src')
});
/* eslint-enable */

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

export default Root;
