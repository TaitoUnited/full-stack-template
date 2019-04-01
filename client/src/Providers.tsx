import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { ThemeProvider } from '~styled';
import theme from '~theme';
import configureStore from '~common/store';
import { connectApiToStore } from '~common/services/api';

const history = createBrowserHistory();
const store = configureStore(history);

connectApiToStore(store);

const Providers = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <div style={{ width: '100vw', height: '100vh' }}>{children}</div>
        </ConnectedRouter>
      </MuiThemeProvider>
    </ThemeProvider>
  </Provider>
);

export default Providers;
