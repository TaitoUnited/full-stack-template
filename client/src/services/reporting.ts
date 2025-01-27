import { init } from '@sentry/browser';

import { config } from '~/constants/config';

export function setupErrorReporting() {
  if (config.ERROR_REPORTING_ENABLED) {
    init({ dsn: config.SENTRY_DSN });
  } else {
    console.log('Ignoring error reporting setup for this environment');
  }
}
