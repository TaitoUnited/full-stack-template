import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';

// Import some devtools
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import { createLogger } from 'redux-logger'; // eslint-disable-line
import { createDevTools } from 'redux-devtools'; // eslint-disable-line
import LogMonitor from 'redux-devtools-log-monitor'; // eslint-disable-line
import DockMonitor from 'redux-devtools-dock-monitor'; // eslint-disable-line

import appReducer from './src/app.reducer.js';
import appSagas from './src/app.sagas.js';
import Root from './index.root'; // eslint-disable-line

// Create store
const history = createHistory();
const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
let store;
if (process.env.NODE_ENV === 'development') {
  // Development
  const logger = createLogger();
  const devtools = window.devToolsExtension
    ? window.devToolsExtension()
    : createDevTools(
      <DockMonitor
        toggleVisibilityKey='ctrl-h'
        changePositionKey='ctrl-w'
        defaultIsVisible={false}
      >
        <LogMonitor />
      </DockMonitor>
      ).instrument();
  store = createStore(
    appReducer,
    compose(
      applyMiddleware(sagaMiddleware, logger),
      applyMiddleware(routeMiddleware),
      devtools
    )
  );
} else {
  // Production
  store = createStore(
    appReducer,
    compose(applyMiddleware(sagaMiddleware), applyMiddleware(routeMiddleware))
  );
}
sagaMiddleware.run(appSagas);

// where to mount on page
const appElement = document.getElementById('app');

const renderApp = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} history={history} />
    </AppContainer>,
    appElement
  );
};

if (process.env.NODE_ENV === 'development') {
  renderApp(Root);
  if (module.hot) {
    module.hot.accept('./src/app.container', () => {
      renderApp(Root);
    });
  }
} else {
  ReactDOM.render(<Root store={store} history={history} />, appElement);
}
