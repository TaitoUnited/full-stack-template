import type { ReactNode } from 'react';

import { Toaster } from '~components/common/toaster';
import { I18nProvider } from '~services/i18n';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <Toaster />
    </I18nProvider>
  );
}
