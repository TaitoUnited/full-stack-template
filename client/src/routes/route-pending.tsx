import { useEffect } from 'react';
import { hideSplashScreen } from 'vite-plugin-splash-screen/runtime';

import { css } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { Spinner } from '~/uikit/spinner';

export function RoutePending() {
  /**
   * Hide splash screen only after the initial pending view has been shown.
   * Tanstack Router will show this pending component for each route change
   * but calling `hideSplashScreen` here will only hide the splash screen
   * after the initial page load and after that calling it is a no-op.
   */
  useEffect(() => {
    return () => {
      hideSplashScreen();
    };
  }, []);

  return (
    <Wrapper>
      <div className={css({ $fadeIn: 300 })}>
        <Spinner size="large" color="primary" />
      </div>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
