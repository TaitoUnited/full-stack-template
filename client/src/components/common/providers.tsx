import type { ReactNode } from 'react';

import { I18nProvider } from '~/services/i18n';
import { Toaster } from '~/uikit/toaster';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <Toaster />
    </I18nProvider>
  );
}
