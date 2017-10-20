import { takeEvery } from 'redux-saga';
import { fork } from 'redux-saga/effects';

function* watchDebug() {
  yield* takeEvery('DEBUG', action =>
    console.debug('[REDUX DEBUG]', action.payload)
  );
}

export default function* root() {
  yield fork(watchDebug);
}
