import { useEffect, useState } from 'react';

import { css } from '~/styled-system/css';
import { styled } from '~/styled-system/jsx';
import { Spinner } from '~/uikit/spinner';

export function RouteSpinner() {
  const [showSpinner, setShowSpinner] = useState(false);

  // Wait a moment before showing the spinner to avoid flickering in case
  // the route is loading quickly, eg. due to link preloading.
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Wrapper>
      {showSpinner && (
        <div className={css({ $fadeIn: 300 })}>
          <Spinner size="large" color="primary" />
        </div>
      )}
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
