import './index.css';

import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { setupErrorReporting } from '~services/reporting';
import { setupApolloClient } from '~graphql';

async function init() {
  setupErrorReporting();

  const apolloClient = await setupApolloClient();

  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
}

init();

// NOTE: Service Worker is enabled only in production builds
// NOTE: check `serviceWorker.ts` if you want to use automatic app update propmt
// TODO: register service worker if needed
// serviceWorker.register();
serviceWorker.unregister();
