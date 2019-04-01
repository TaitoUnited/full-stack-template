import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { History } from 'history';

import navigationReducer from '../navigation/navigation.model';

function* rootSaga(): any {
  yield all([]);
}

export default function configureStore(history: History) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [routerMiddleware(history), sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger'); // eslint-disable-line
    middlewares.push(logger);
  }

  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));

  const rootReducer = combineReducers({
    navigation: navigationReducer,
    router: connectRouter(history),
  });

  const store = createStore(rootReducer, undefined, enhancer);

  sagaMiddleware.run(rootSaga);

  return store;
}
