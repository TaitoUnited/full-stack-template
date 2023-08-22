import './index.css';

import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import App from './App';
import { setupErrorReporting } from '~services/reporting';
import { setupFeatureFlags } from '~utils/feature-flags';
import { setupApolloClient } from '~graphql';

async function init() {
  setupErrorReporting();
  setupFeatureFlags();

  const apolloClient = await setupApolloClient();

  // TODO: consider adding StrictMode
  // It's important to note that it will cause double effects in dev mode!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ReactDOM.createRoot(document.getElementById('app')!).render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
}

init();
