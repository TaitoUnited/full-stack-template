import { fetchUtils, DECLARE_RESOURCES } from 'admin-on-rest';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import update from 'immutability-helper';

import { createTypes } from './action.util';
import { addTokenToOptions } from './api/api.util';

export const COMMON = createTypes('COMMON', ['RECEIVE_CONFIG']);
export const receiveConfig = createAction(COMMON.RECEIVE_CONFIG);

const initialState = {
  config: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case COMMON.RECEIVE_CONFIG:
    return update(state, {
      config: { $set: action.payload }
    });
  default:
    return state;
  }
}

export const getConfig = state => state.common.config;

const fetchConfig = () => {
  // TODO move to api directory?
  const options = {};
  addTokenToOptions(options);

  return fetchUtils
    .fetchJson(`${process.env.API_URL}/infra/config`, options)
    .then(response => response.json.data);
};

function* handleFetchConfig() {
  try {
    const config = yield call(fetchConfig);
    yield put(receiveConfig(config));
  } catch (e) {
    console.log('Error fetching config', e);
  }
}

export function* commonSagas() {
  yield all([
    /**
     * NOTE: !!!
     * Investigate if there is a better action type to use for recognizing
     * when the admin app has initialized.
     */
    takeEvery(DECLARE_RESOURCES, handleFetchConfig)
  ]);
}
