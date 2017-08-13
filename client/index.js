import 'babel-polyfill'; // emulate ES6 features

import React from 'react';
import ReactDOM from 'react-dom';

// app specific imports
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import Root from './root.container';

// TODO: configure Redux store
const store = {};

const rootElement = document.getElementById('root'); // where to mount on page

const renderApp = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    rootElement
  );
};

if (process.env.NODE_ENV === 'production') {
  ReactDOM.render(
    <Root store={store} />,
    rootElement
  );
} else {
  renderApp(Root);

  if (module.hot) {
    module.hot.accept('./root.container', () => {
      renderApp(Root);
    });
  }
}
