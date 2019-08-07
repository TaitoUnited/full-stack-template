import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { ThemeProvider } from 'styled-components';

import configureStore from './store';
import theme from '~theme';
import { connectApiToStore } from '~common/services/api';
import { I18nProvider } from '~ui';

const history = createBrowserHistory();
const store = configureStore(history);

connectApiToStore(store);

const Providers = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <MuiThemeProvider theme={theme}>
        <I18nProvider>
          <ConnectedRouter history={history}>
            <div style={{ width: '100vw', height: '100vh' }}>{children}</div>
          </ConnectedRouter>
        </I18nProvider>
      </MuiThemeProvider>
    </ThemeProvider>
  </Provider>
);

export default Providers;
