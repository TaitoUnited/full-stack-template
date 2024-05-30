import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { styled } from '~styled-system/jsx';
import { Spinner } from '~uikit';

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Spinner size="large" color="primary" />
        </motion.div>
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
