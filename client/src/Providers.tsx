import type { ReactNode } from 'react';
import { OverlayProvider } from 'react-aria';
import { BrowserRouter as Router } from 'react-router-dom';

import Toaster from '~components/common/Toaster';
import { I18nProvider } from '~services/i18n';
import { AuthProvider } from '~services/auth';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <I18nProvider>
        <OverlayProvider>
          <Router>{children}</Router>
        </OverlayProvider>
        <Toaster />
      </I18nProvider>
    </AuthProvider>
  );
}
