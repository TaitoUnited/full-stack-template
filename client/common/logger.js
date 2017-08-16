import Raven from 'raven-js';
import axios from 'axios';

// TODO use some existing logger / exception handler lib?
const logger = {
  log: (ex) => {
    console.log(ex);
  },
  warn: (ex) => {
    console.warn(ex);
  },
  error: (ex, context) => {
    if (context) {
      console.log(JSON.stringify(context));
    }
    console.error(ex);
  },
};

// Setup Sentry
if (process.env.COMMON_ENV !== 'local') {
  Raven.config(process.env.APP_SENTRY_PUBLIC_DSN, {
    release: `${process.env.BUILD_VERSION}+${process.env.BUILD_IMAGE_TAG}`,
    environment: process.env.COMMON_ENV,
  }).install();

  logger.error = (ex, context) => {
    Raven.captureException(ex, {
      extra: context,
    });
    Raven.showReportDialog();
    /* eslint no-console:0 */
    console.error(ex);
  };
}

// Setup global exception handling for axios
axios.interceptors.response.use(null, (error) => {
  if (!error.response || error.response.status >= 500) {
    logger.error(error);
  }
  return Promise.reject(error);
});

export default logger;
