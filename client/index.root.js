import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import LazyLoadHandler from '~infra/lazyLoad.handler';

/* eslint-disable */
const AppContainer = LazyLoadHandler({
  loader: () =>
    import(/* webpackChunkName: "vanilla-container" */
    './app/app.container')
});
/* eslint-enable */

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppContainer />
    </ConnectedRouter>
  </Provider>
);

export default Root;
