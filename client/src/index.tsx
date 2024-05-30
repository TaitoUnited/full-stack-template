import './index.css';

import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import { App } from './App';
import { setupErrorReporting } from '~services/reporting';
import { setupFeatureFlags } from '~utils/feature-flags';
import { setupApolloClient } from '~graphql';
import { setupMessages } from '~services/i18n';

async function init() {
  setupErrorReporting();
  setupFeatureFlags();
  await setupMessages();

  const apolloClient = await setupApolloClient();

  // TODO: consider adding StrictMode
  // It's important to note that it will cause double effects in dev mode!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  createRoot(document.getElementById('app')!).render(
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
}

init();
