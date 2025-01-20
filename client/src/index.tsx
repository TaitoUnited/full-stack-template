import './index.css';

import { ApolloProvider } from '@apollo/client';
import loadable from '@loadable/component';
import { RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

import { Providers } from '~components/common/Providers';
import { config, loadRemoteConfig } from '~constants/config';
import { setupApolloClient } from '~graphql';
import { setupFeatureFlags } from '~services/feature-flags';
import { setupMessages } from '~services/i18n';
import { setupErrorReporting } from '~services/reporting';

import { setupRouter } from './route-setup';

const FeatureFlagManager = loadable(
  () => import('~components/feature-flags/FeatureFlagManager')
);

async function init() {
  setupErrorReporting();
  setupFeatureFlags();

  const apolloClient = setupApolloClient();
  const router = setupRouter(apolloClient);

  await Promise.allSettled([loadRemoteConfig(), setupMessages()]);

  createRoot(document.getElementById('app')!).render(
    <ApolloProvider client={apolloClient}>
      <Providers>
        <RouterProvider router={router} />
        {config.ENV !== 'prod' && <FeatureFlagManager />}
      </Providers>
    </ApolloProvider>
  );
}

init();
