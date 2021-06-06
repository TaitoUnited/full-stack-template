import * as Sentry from '@sentry/browser';
import config from '~constants/config';

export const setupErrorReporting = () => {
  if (config.ERROR_REPORTING_ENABLED) {
    Sentry.init({ dsn: config.SENTRY_PUBLIC_DSN });
  } else {
    console.log('> Ignoring error reporting setup for this environment');
  }
};
