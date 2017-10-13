import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import Root from './index.root';

// TODO: configure Redux store
const store = {};

 // where to mount on page
const appElement = document.getElementById('app');

const renderApp = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    appElement,
  );
};

if (process.env.NODE_ENV === 'production') {
  ReactDOM.render(
    <Root store={store} />,
    appElement,
  );
} else {
  renderApp(Root);

  if (module.hot) {
    module.hot.accept('./app/app.container', () => {
      renderApp(Root);
    });
  }
}
