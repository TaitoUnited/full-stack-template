import { fork, takeEvery } from 'redux-saga/effects';
import searchSagas from './search/sagas';

function* watchDebug() {
  yield takeEvery('DEBUG', action =>
    console.debug('[REDUX DEBUG]', action.payload));
}

export default function* root() {
  yield fork(watchDebug);
  yield fork(searchSagas);
}
