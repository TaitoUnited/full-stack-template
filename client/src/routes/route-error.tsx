import { captureException } from '@sentry/browser';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';

import { ErrorView } from '~/components/common/error-view';
import { config } from '~/constants/config';
import { styled } from '~/styled-system/jsx';

// See: https://tanstack.com/router/latest/docs/framework/react/api/router/errorComponentComponent#errorcomponent-returns
export function RouteError({ error }: ErrorComponentProps) {
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
