import { createActions, handleActions } from 'redux-actions';

// NOTE: use any Redux framework you want to reduce the boilerplate

const initialState = {
  language: 'en',
};

// Actions
const { settings: actions } = createActions({
  SETTINGS: {
    CHANGE_LANGUAGE: language => ({ language }),
  },
}) as any;

// Reducer
export default handleActions(
  {
    [actions.changeLanguage]: (state, action: any) => ({
      ...state,
      language: action.payload.language || 'en',
    }),
  },
  initialState
);

// Bundle things in a model
export const settings = {
  actions,
  selector: {},
};
