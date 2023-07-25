import { AnimatePresence } from 'framer-motion';
import { useOverlayTriggerState } from 'react-stately';

import { css } from '~styled-system/css';
import { styled } from '~styled-system/jsx';
import { Stack, FillButton, OutlineButton, Text, Drawer } from '~uikit';

export default {
  title: 'Drawer',
  component: Drawer,
};

export function Example() {
  return <DrawerExample />;
}

// NOTE: for some reason Storybook breaks if you use hooks inside the story component...
function DrawerExample() {
  const state = useOverlayTriggerState({});

  return (
    <Wrapper>
      <FillButton variant="primary" onClick={() => state.open()}>
        Open drawer
      </FillButton>

      <AnimatePresence>
        {state.isOpen && (
          <Drawer onClose={state.close} title="Example drawer">
            <Stack
              direction="column"
              gap="$large"
              align="center"
              justify="space-between"
              className={css({ flex: 1, padding: '$medium' })}
            >
              <Text variant="body" aria-hidden>
                Example drawer
              </Text>

              <OutlineButton variant="info" onClick={() => state.close()}>
                Close
              </OutlineButton>
            </Stack>
          </Drawer>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    padding: '$medium',
  },
});
