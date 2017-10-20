import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  example: 'example'
};

// Actions
export const { files } = createActions({
  FILES: {
    EXAMPLE: example => ({ example })
  }
});

// Reducer
export const filesReducer = handleActions(
  {
    [files.example](state, { payload: { example } }) {
      return update(state, {
        example: { $set: example }
      });
    }
  },
  defaultState
);
