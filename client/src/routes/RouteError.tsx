import { captureException } from '@sentry/browser';
import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

import { ErrorView } from '~components/common/ErrorView';
import { config } from '~constants/config';
import { styled } from '~styled-system/jsx';

// See: https://reactrouter.com/en/main/route/error-element
export function RouteError() {
  const error = useRouteError();

  useEffect(() => {
    if (error) {
      console.log('Root route error', error);

      if (config.ERROR_REPORTING_ENABLED) {
        captureException(error);
      } else {
        console.log('Not sending error reports for this enviroment!');
      }
    }
  }, [error]);

  return (
    <Wrapper>
      <ErrorView />
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
