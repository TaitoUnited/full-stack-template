import 'babel-polyfill'; // emulate ES6 features

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import './assets/defaults.css';

const appElement = document.getElementById('app');

const renderApp = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    appElement
  );
};

let App;

if (process.env.NODE_ENV === 'production') {
  App = require('./app/app.container').default; // eslint-disable-line
  ReactDOM.render(<App />, appElement);
} else {
  // In development we want HMR
  App = require('./app/app.container').default; // eslint-disable-line

  renderApp(App);

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept('./app/app.container', () => {
      const NextApp = require('./app/app.container').default; // eslint-disable-line
      renderApp(NextApp);
    });
  }
}
