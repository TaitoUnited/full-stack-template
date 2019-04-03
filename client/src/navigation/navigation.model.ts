import { createActions, handleActions } from 'redux-actions';

// NOTE: use any Redux framework you want to reduce the boilerplate

const initialState = {
  menuVisible: false,
};

// Actions
const { common: actions } = createActions({
  COMMON: {
    TOGGLE_MENU: visible => ({ visible }),
  },
}) as any;

// Reducer
export default handleActions(
  {
    [actions.toggleMenu]: (state, action: any) => ({
      ...state,
      menuVisible:
        action.payload.visible !== undefined
          ? action.payload.visible
          : !state.menuVisible,
    }),
  },
  initialState
);

// Bundle things in a model
export const navigation = {
  actions,
  selector: {},
};
