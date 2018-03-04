import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { commonReducer as common } from './common/common.ducks.js';
import { filesReducer as files } from './files/files.ducks.js';
import { reportsReducer as reports } from './reports/reports.ducks.js';
import { searchReducer as search } from './search/search.ducks.js';
import { usersReducer as users } from './users/users.ducks.js';

// App reducer
const appReducer = combineReducers({
  common,
  files,
  reports,
  search,
  users,
  router: routerReducer
});

export default appReducer;
