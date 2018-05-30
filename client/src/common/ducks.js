import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  menuVisible: false,
  user: null,
  drawerVisible: true, // TODO move to search
  // TODO remove
  databasesBySection: {
    initialized: true,
    images: [],
    posts: []
  }
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
    [common.login](
      state,
      {
        payload: { user }
      }
    ) {
      return { ...state, user };
    },
    [common.logout]() {
      return defaultState;
    },
    [common.toggleMenu](
      state,
      {
        payload: { visible }
      }
    ) {
      const v = visible !== undefined ? visible : !state.menuVisible;
      return update(state, {
        menuVisible: { $set: v }
      });
    }
  },
  defaultState
);
