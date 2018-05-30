import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { commonReducer as common } from './common/ducks';
import { searchReducer as search } from './search/common/ducks';

// App reducer
const appReducer = combineReducers({
  common,
  search,
  router: routerReducer
});

export default appReducer;
