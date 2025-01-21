import './index.css';

import { ApolloProvider } from '@apollo/client';
import { createRoot } from 'react-dom/client';

import { setupApolloClient } from '~graphql';
import { setupFeatureFlags } from '~services/feature-flags';
import { setupMessages } from '~services/i18n';
import { setupErrorReporting } from '~services/reporting';

import { App } from './App';

async function init() {
  setupErrorReporting();
  setupFeatureFlags();
  await setupMessages();

  const apolloClient = await setupApolloClient();

  // TODO: consider adding StrictMode
  // It's important to note that it will cause double effects in dev mode!

  createRoot(document.getElementById('app')!).render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
}

init();
