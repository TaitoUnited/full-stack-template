import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  menuVisible: true,
  user: null
};

// Actions
export const { common } = createActions({
  COMMON: {
    LOGIN: user => ({ user }),
    LOGOUT: () => ({}),
    TOGGLE_MENU: visible => ({ visible })
  }
});

// Reducer
export const commonReducer = handleActions(
  {
    [common.login](state, { payload: { user } }) {
      return { ...state, user };
    },
    [common.logout]() {
      return defaultState;
    },
    [common.toggleMenu](state, { payload: { visible } }) {
      const v = visible !== undefined ? visible : !state.menuVisible;
      return update(state, {
        menuVisible: { $set: v }
      });
    }
  },
  defaultState
);
