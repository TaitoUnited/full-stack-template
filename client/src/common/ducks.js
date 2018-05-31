import update from 'immutability-helper';
import { createActions, handleActions } from 'redux-actions';

// Default state
const defaultState = {
  menuVisible: false
};

// Actions
export const { common } = createActions({
  COMMON: {
    TOGGLE_MENU: visible => ({ visible })
  }
});

// Reducer
export const commonReducer = handleActions(
  {
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
