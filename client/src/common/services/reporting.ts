import * as Sentry from '@sentry/browser';
import config from '../config';

const setupErrorReporting = () => {
  if (config.ERROR_REPORTING_ENABLED) {
    Sentry.init({
      dsn: config.SENTRY_PUBLIC_DSN,
    });
  } else {
    console.log('> Ignoring error reporting setup for this environment');
  }
};

const errorReporting = {
  setup: setupErrorReporting,
};

export default errorReporting;
