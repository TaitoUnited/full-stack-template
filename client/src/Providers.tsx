import type { ReactNode } from 'react';
import { OverlayProvider } from 'react-aria';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import Toaster from '~components/common/Toaster';
import { ThemingProvider } from '~services/theming';
import { I18nProvider } from '~services/i18n';
import { AuthProvider } from '~services/auth';
import { apolloClient } from '~graphql';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemingProvider>
        <AuthProvider>
          <I18nProvider>
            <OverlayProvider>
              <Router>{children}</Router>
            </OverlayProvider>
            <Toaster />
          </I18nProvider>
        </AuthProvider>
      </ThemingProvider>
    </ApolloProvider>
  );
}
