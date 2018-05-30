import { fork, takeEvery } from 'redux-saga/effects';

import postsApi from '~entities/posts.api';

import { searchSagas, searchSagasInit } from './search/common/sagas';

const errorHandler = err => {
  if (err.statusCode === 403) window.location.reload();
  if (err.response && err.response.status === 403) window.location.reload();
};

const sectionsByPath = {
  '/search': 'images'
};

searchSagasInit(
  // sectionsByPath
  sectionsByPath,
  // apisBySection
  {
    images: postsApi,
    posts: postsApi
  },
  // criteriaTypeByName
  {
    photographers: 'array',
    magazines: 'array'
  },
  errorHandler
);

function* watchDebug() {
  yield takeEvery('DEBUG', action =>
    console.debug('[REDUX DEBUG]', action.payload));
}

export default function* root() {
  yield fork(watchDebug);
  yield fork(searchSagas);
}
