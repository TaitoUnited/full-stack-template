import type { ReactNode } from 'react';
import { OverlayProvider } from 'react-aria';
import { BrowserRouter as Router } from 'react-router-dom';

import Toaster from '~components/common/Toaster';
import { ThemeProvider } from '~services/theming';
import { I18nProvider } from '~services/i18n';
import { AuthProvider } from '~services/auth';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nProvider>
          <OverlayProvider>
            <Router>{children}</Router>
          </OverlayProvider>
          <Toaster />
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
