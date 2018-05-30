// import moment from 'moment';
import { delay } from 'redux-saga';
import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  fork
} from 'redux-saga/effects';
import queryString from 'query-string';

import { addSearchStateToPath } from './utils';

// Init

let apisBySection;
let criteriaTypeByName;
let sectionsByPath;
let errorHandler;

export const searchSagasInit = (
  sectionsByPathParam,
  apisBySectionParam,
  criteriaTypeByNameParam,
  errorHandlerParam
) => {
  sectionsByPath = sectionsByPathParam;
  apisBySection = apisBySectionParam;
  criteriaTypeByName = criteriaTypeByNameParam;
  errorHandler = errorHandlerParam;
};

// Fetch options from server according to a changed criteria value.
// For example, user changes value of a search criteria and options of
// an another field is populated based on that.

function* fetchCriteriaOptions(action) {
  const { section } = action.payload;
  try {
    // Fetch new options
    const criteriaOptions = yield call(apisBySection[section].fetchOptions, {
      section,
      changedCriteriaName: action.payload.name,
      changedCriteriaValue: action.payload.value
    });

    if (criteriaOptions) {
      yield put({
        type: 'SEARCH/FETCH_CRITERIA_OPTIONS_SUCCEEDED',
        payload: {
          section,
          criteriaOptions
        }
      });
    }
  } catch (e) {
    yield put({
      type: 'SEARCH/FETCH_CRITERIA_OPTIONS_FAILED',
      payload: {
        section,
        message: e.message
      }
    });
    errorHandler(e);
  }
}

function* watchFetchCriteriaOptions() {
  yield takeEvery('SEARCH/UPDATE_CRITERIA', fetchCriteriaOptions);
}

function* fetchAllCriteriaOptions(action) {
  try {
    const { section } = action.payload;
    const { criteria } = action.payload.newSectionState;

    const all = [];
    Object.entries(criteria).forEach(entry => {
      all.push(fetchCriteriaOptions({
        payload: {
          section,
          name: entry[0],
          value: entry[1]
        }
      }));
    });

    yield all;
  } catch (err) {
    console.error(err);
    errorHandler(err);
  }
}

function* watchFetchAllCriteriaOptions() {
  yield takeEvery('SEARCH/SET', fetchAllCriteriaOptions);
}

// Read a single item from server

function* readItem({ section, criteria, itemId }) {
  try {
    const item = yield call(apisBySection[section].readItem, {
      section,
      criteria,
      itemId
    });
    yield put({
      type: 'SEARCH/READ_ITEM_SUCCEEDED',
      payload: {
        section,
        item
      }
    });
  } catch (e) {
    yield put({
      type: 'SEARCH/READ_ITEM_FAILED',
      payload: {
        section,
        message: e.message
      }
    });
    errorHandler(e);
  }
}

// Fetch items from server

// TODO: This is a quick hack used to inform that some item
// should be opened automatically after the next successfull fetch
let openAfterFetchId = null;

function* fetchItems(action) {
  const { section } = action.payload;
  try {
    const currentState = yield select(state => {
      return {
        section: sectionsByPath[state.router.location.pathname],
        criteria: state.search[section].criteria,
        paging: state.search[section].paging,
        selectedIndex: state.search[section].results.selectedIndex
      };
    });

    const executeSearch =
      // Execute search for current section only
      section.startsWith(currentState.section) &&
      // UPDATE_CRITERIA triggers search only when search is requested
      (action.type !== 'SEARCH/UPDATE_CRITERIA' || action.payload.doSearch) &&
      // SET and RELOAD trigger search only if simpleText is set
      (action.type !== 'SEARCH/SET' || currentState.criteria.simpleText) &&
      (action.type !== 'SEARCH/RELOAD' || currentState.criteria.simpleText);

    if (executeSearch) {
      yield put({
        type: 'SEARCH/FETCH_ITEMS_STARTED',
        payload: {
          section
        }
      });

      yield call(delay, 500);

      const response = yield call(apisBySection[section].fetchItems, {
        section,
        criteria: currentState.criteria,
        paging: currentState.paging
      });

      yield put({
        type: 'SEARCH/FETCH_ITEMS_SUCCEEDED',
        payload: {
          section,
          items: response.items,
          isSorted: response.isSorted,
          totalCount: response.totalCount
        }
      });

      // Determine item to be opened from result set or read from server
      let readItemId = null;
      let itemIndex = currentState.selectedIndex;
      if (openAfterFetchId) {
        itemIndex = response.items.findIndex(item => {
          return item.id === openAfterFetchId;
        });
        // If item was not found in result set, it must be read separately
        // from the API
        readItemId = itemIndex === -1 ? openAfterFetchId : null;
        openAfterFetchId = null;
      }

      // Open the selected item
      if (itemIndex !== -1) {
        yield put({
          type: 'SEARCH/SELECT_ITEM',
          payload: {
            section,
            index: -1
          }
        });
        // TODO this is a hack: using delay to wait for render
        // and then open the item again to trigger scrolling etc
        yield call(delay, 800);
        yield put({
          type: 'SEARCH/SELECT_ITEM',
          payload: {
            section,
            index: itemIndex
          }
        });
      }

      // Item was not found in result set -> read it separately
      if (readItemId) {
        yield call(readItem, {
          section,
          criteria: currentState.criteria,
          itemId: readItemId
        });
      }

      // Scroll to the top.
      // TODO: This should probably be somewhere else?
      window.scrollTo(0, 0);
    }
  } catch (e) {
    yield put({
      type: 'SEARCH/FETCH_ITEMS_FAILED',
      payload: {
        section,
        message: e.message
      }
    });
    errorHandler(e);
  }
}

function* watchFetchItems() {
  const searchTriggers = {
    'SEARCH/SET': true,
    'SEARCH/UPDATE_CRITERIA': true,
    'SEARCH/UPDATE_PAGING': true,
    'SEARCH/RELOAD': true
  };
  yield takeLatest(action => searchTriggers[action.type], fetchItems);
}

// Manipulate browser history

function* pushBrowserHistory(action) {
  try {
    const { section } = action.payload;
    const path = yield select(state => {
      return state.router.location.pathname;
    });

    if (section === sectionsByPath[path]) {
      const url = yield select(state => {
        // Map the selectedIndex to a selectedId to used as url hash
        let selectedId = null;
        const searchState = state.search[section];
        const { results } = searchState;
        if (results.items[results.selectedIndex]) {
          selectedId = results.items[results.selectedIndex].id;
        }
        return addSearchStateToPath(
          path,
          searchState.criteria,
          searchState.paging,
          selectedId,
          true
        );
      });
      if (
        action.type === 'SEARCH/REFRESH' ||
        action.type === 'SEARCH/SELECT_ITEM' ||
        action.type === 'SEARCH/SHOW_ITEM'
      ) {
        window.history.replaceState({}, section, url);
      } else {
        window.history.pushState({}, section, url);
      }
    }
  } catch (err) {
    console.error(err);
    errorHandler(err);
  }
}

function* watchPushBrowserHistory() {
  const searchTriggers = {
    'SEARCH/CLEAR': true,
    'SEARCH/REFRESH': true,
    'SEARCH/UPDATE_CRITERIA': true,
    'SEARCH/UPDATE_PAGING': true,
    'SEARCH/SELECT_ITEM': true,
    'SEARCH/SHOW_ITEM': true
  };
  yield takeLatest(action => searchTriggers[action.type], pushBrowserHistory);
}

function* fetchByUrlParams() {
  try {
    const currentState = yield select(state => {
      const section = sectionsByPath[state.router.location.pathname];
      return {
        user: state.common.user,
        section,
        pageSize:
          state.search[section] && state.search[section].paging.pageSize,
        locationParams: state.router.location.search,
        hash: state.router.location.hash
      };
    });

    if (currentState.user && apisBySection[currentState.section]) {
      if (currentState.section) {
        let newSectionState = null;
        if (currentState.locationParams) {
          const queryParams = queryString.parse(currentState.locationParams);

          // Convert array criterias to array
          Object.keys(queryParams).forEach(key => {
            const value = queryParams[key];
            let formattedValue = null;
            if (criteriaTypeByName[key] === 'array' && !Array.isArray(value)) {
              formattedValue = [value];
              // } else if (key.endsWith('Date')) {
              //   // TODO avoid moment in common implementation?
              //   formattedValue = value ? moment(value) : null;
            } else if (key.endsWith('Switch')) {
              formattedValue = value === 'true';
            } else {
              formattedValue = value;
            }
            queryParams[key] = formattedValue;
          });

          const { page, pageSize, ...criteria } = queryParams;
          newSectionState = {
            paging: {
              page: parseInt(page, 10) - 1,
              pageSize: pageSize
                ? parseInt(pageSize, 10)
                : currentState.pageSize
            },
            criteria,
            inputValues: criteria
          };

          openAfterFetchId = currentState.hash
            ? currentState.hash.substring(1)
            : null;

          yield put({
            type: 'SEARCH/SET',
            payload: {
              section: currentState.section,
              newSectionState: newSectionState || {}
            }
          });
        } else {
          console.warn(`
            Pushing current search state to url because state is missing.
            It is preferable to populate search state manually to links by using
            the addSearchStateToPath function.`);
          yield put({
            type: 'SEARCH/REFRESH',
            payload: { section: currentState.section }
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
    errorHandler(err);
  }
}

function* watchFetchByUrlParams() {
  const triggers = {
    'COMMON/INIT_USER': true,
    '@@router/LOCATION_CHANGE': true // TODO can be removed?
  };
  yield takeLatest(action => triggers[action.type], fetchByUrlParams);
}

// Init

export function* searchSagas() {
  yield fork(watchFetchCriteriaOptions);
  yield fork(watchFetchAllCriteriaOptions);
  yield fork(watchFetchItems);
  yield fork(watchPushBrowserHistory);
  yield fork(watchFetchByUrlParams);
}
