import Raven from 'raven';
import config from '../common/config';

const setupSentry = () => {
  if (
    process.env.COMMON_ENV !== 'local' &&
    process.env.APP_SENTRY_DSN &&
    process.env.APP_SENTRY_DSN.startsWith('https')
  ) {
    // TODO: put this url somewhere else
    Raven.config(process.env.APP_SENTRY_DSN, {
      release: config.APP_VERSION,
      environment: process.env.COMMON_ENV,
    }).install();
  }
};

export default setupSentry;
