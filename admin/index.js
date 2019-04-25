import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

// TODO: why this has been imported?
import './assets/css/defaults.css';

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
  App = require('./src/app.container').default; // eslint-disable-line
  ReactDOM.render(<App />, appElement);
} else {
  // In development we want HMR
  App = require('./src/app.container').default; // eslint-disable-line

  renderApp(App);

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept('./src/app.container', () => {
      const NextApp = require('./src/app.container').default; // eslint-disable-line
      renderApp(NextApp);
    });
  }
}
