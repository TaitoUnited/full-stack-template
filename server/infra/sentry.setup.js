import Raven from 'raven';

const setupSentry = () => {
  /* eslint-disable max-len */
  if (process.env.COMMON_ENV !== 'local') {
    // TODO: put this url somewhere else
    Raven.config(
      'https://ea2f3adda35742608a300e3b0b458c18:1045529c2ead427b8b867ce5ba789290@sentry.io/179203',
      {
        release: 'TODO',
        environment: process.env.COMMON_ENV,
      },
    ).install();
  }
  /* eslint-enable max-len */
};

export default setupSentry;
