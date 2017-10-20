import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  criteria: {
    query: null,
    sortBy: null,
    page: 2,
    pageSize: 20
  },
  results: {
    totalNumOfItems: 234,
    items: [{ type: 'picture', name: 'jee' }]
  }
};

// Actions
export const { search } = createActions({
  SEARCH: {
    RESET: () => ({}),
    UPDATE_CRITERIA: (name, value) => ({ name, value }),
    SELECT_PAGE: page => ({ page }),
    AFTER_FETCH: (items, totalNumOfItems) => ({ items, totalNumOfItems })
  }
});

// Reducer
export const searchReducer = handleActions(
  {
    [search.reset]() {
      return defaultState;
    },
    [search.updateCriteria](state, { payload: { name, value } }) {
      return update(state, {
        criteria: { [name]: { $set: value } }
      });
    },
    [search.selectPage](state, { payload: { page } }) {
      return update(state, {
        criteria: { page: { $set: page } }
      });
    },
    [search.afterFetch](state, { payload: { totalNumOfItems, items } }) {
      return update(state, {
        results: {
          items: { $set: items },
          totalNumOfItems: { $set: totalNumOfItems }
        }
      });
    }
  },
  defaultState
);
