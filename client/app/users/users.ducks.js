import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  example: 'example'
};

// Actions
export const { users } = createActions({
  USERS: {
    EXAMPLE: example => ({ example })
  }
});

// Reducer
export const usersReducer = handleActions(
  {
    [users.example](state, { payload: { example } }) {
      return update(state, {
        example: { $set: example }
      });
    }
  },
  defaultState
);
