import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  example: 'example'
};

// Actions
export const { reports } = createActions({
  REPORTS: {
    EXAMPLE: example => ({ example })
  }
});

// Reducer
export const reportsReducer = handleActions(
  {
    [reports.example](state, { payload: { example } }) {
      return update(state, {
        example: { $set: example }
      });
    }
  },
  defaultState
);
