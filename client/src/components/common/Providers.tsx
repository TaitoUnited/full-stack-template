import type { ReactNode } from 'react';

import { Toaster } from '~components/common/Toaster';
import { I18nProvider } from '~services/i18n';
import { AuthProvider } from '~services/auth';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <I18nProvider>
        {children}
        <Toaster />
      </I18nProvider>
    </AuthProvider>
  );
}
