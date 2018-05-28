import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  inputValues: {
    query: null
  },
  inputAutocomplete: {
    query: []
  },
  criteria: {
    query: null
  },
  paging: {
    page: 0,
    pageSize: 20,
    sortBy: 'name'
  },
  results: {
    status: 'idle',
    items: [],
    totalCount: 0,
    selectedIndex: null
  }
};

// Actions
export const { search } = createActions({
  SEARCH: {
    RESET: () => ({}),
    // User actions
    UPDATE_INPUT_VALUE: (name, value) => ({ name, value }),
    UPDATE_CRITERIA: (name, value) => ({ name, value }),
    UPDATE_PAGING: (name, value) => ({ name, value }),
    SELECT_ITEM: index => ({ index }),
    // Autocomplete actions
    FETCH_AUTOCOMPLETE_SUCCEEDED: (name, items) => ({ name, items }),
    // Fetch results actions
    FETCH_RESULTS_STARTED: () => ({}),
    FETCH_RESULTS_SUCCEEDED: ({ items, totalCount }) => ({
      items,
      totalCount
    }),
    FETCH_RESULTS_FAILED: message => ({ message })
  }
});

// Reducer
export const searchReducer = handleActions(
  {
    [search.reset]() {
      return defaultState;
    },

    // User actions

    [search.updateInputValue](
      state,
      {
        payload: { name, value }
      }
    ) {
      return update(state, {
        inputValues: { [name]: { $set: value } }
      });
    },
    [search.updateCriteria](
      state,
      {
        payload: { name, value }
      }
    ) {
      return update(state, {
        paging: { page: { $set: 0 } },
        criteria: { [name]: { $set: value } },
        results: { totalCount: { $set: 0 }, selectedIndex: { $set: null } }
      });
    },
    [search.updatePaging](
      state,
      {
        payload: { name, value }
      }
    ) {
      return update(state, {
        paging: { [name]: { $set: value } },
        results: { selectedIndex: { $set: null } }
      });
    },
    [search.selectItem](
      state,
      {
        payload: { index }
      }
    ) {
      return update(state, {
        results: { selectedIndex: { $set: index } }
      });
    },

    // Autocomplete actions

    [search.fetchAutocompleteSucceeded](
      state,
      {
        payload: { name, items }
      }
    ) {
      return update(state, {
        inputAutocomplete: { [name]: { $set: items } }
      });
    },

    // Fetch results actions

    [search.fetchResultsStarted](state) {
      return update(state, {
        results: {
          status: { $set: 'fetching' },
          items: { $set: [] }
        }
      });
    },
    [search.fetchResultsSucceeded](
      state,
      {
        payload: { totalCount, items }
      }
    ) {
      return update(state, {
        results: {
          status: { $set: 'idle' },
          items: { $set: items },
          totalCount: { $set: totalCount }
        }
      });
    },
    [search.fetchResultsFailed](state) {
      return update(state, {
        results: { status: { $set: 'error' } }
      });
    }
  },
  defaultState
);
