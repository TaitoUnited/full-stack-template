import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { History } from 'history';

import navigationReducer from './navigation/navigation.model';
import settingsReducer from './settings/settings.model';

function* rootSaga(): any {
  yield all([
    // NOTE: add sagas here
  ]);
}

export default function configureStore(history: History) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [routerMiddleware(history), sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger'); // eslint-disable-line
    middlewares.push(logger);
  }

  const devToolsCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const composeEnhancers = devToolsCompose
    ? devToolsCompose({
        trace: true,
        traceLimit: 10, // This is default limit imposed by Chrome.
        // Increase if you need to see more of stacktrace.
      })
    : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));

  const rootReducer = combineReducers({
    // NOTE: add reducers here
    settings: settingsReducer,
    navigation: navigationReducer,
    router: connectRouter(history),
  });

  const store = createStore(rootReducer, undefined, enhancer);

  sagaMiddleware.run(rootSaga);

  return store;
}
