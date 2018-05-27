import { call, put, takeLatest, select, fork } from 'redux-saga/effects';
import filesApi from './api';

const getCriteria = state => state.search.criteria;
const getPaging = state => state.search.paging;

// Autocomplete

function* fetchAutocomplete(action) {
  try {
    const response = yield call(filesApi.fetchAutocomplete, action.payload);
    yield put({
      type: 'SEARCH/FETCH_AUTOCOMPLETE_SUCCEEDED',
      payload: { name: action.payload.name, items: response.data }
    });
  } catch (e) {
    yield put({ type: 'SEARCH/FETCH_AUTOCOMPLETE_FAILED', message: e.message });
  }
}

function* watchFetchAutocomplete() {
  yield takeLatest('SEARCH/UPDATE_INPUT_VALUE', fetchAutocomplete);
}

// Fetch results

function* fetchResults() {
  try {
    yield put({ type: 'SEARCH/FETCH_RESULTS_STARTED' });
    const criteria = yield select(getCriteria);
    const paging = yield select(getPaging);
    const response = yield call(filesApi.fetch, { criteria, paging });
    yield put({
      type: 'SEARCH/FETCH_RESULTS_SUCCEEDED',
      payload: {
        items: response.data,
        totalCount: response.headers['X-Total-Count']
      }
    });
  } catch (e) {
    yield put({ type: 'SEARCH/FETCH_RESULTS_FAILED', message: e.message });
  }
}

function* watchFetchResults() {
  const searchTriggers = {
    'SEARCH/UPDATE_CRITERIA': true,
    'SEARCH/UPDATE_PAGING': true
  };
  yield takeLatest(action => searchTriggers[action.type], fetchResults);
}

// Init

export default function* searchSagas() {
  yield fork(watchFetchResults);
  yield fork(watchFetchAutocomplete);
}
