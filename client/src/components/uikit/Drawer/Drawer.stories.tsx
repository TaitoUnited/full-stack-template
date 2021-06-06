import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useOverlayTriggerState } from 'react-stately';

import FillButton from '../Buttons/FillButton';
import OutlineButton from '../Buttons/OutlineButton';
import Stack from '../Stack';
import Text from '../Text';
import Drawer from './index';

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
            <DrawerContent
              axis="y"
              spacing="large"
              align="center"
              justify="space-between"
            >
              <Text variant="body" aria-hidden>
                Example drawer
              </Text>

              <OutlineButton variant="info" onClick={() => state.close()}>
                Close
              </OutlineButton>
            </DrawerContent>
          </Drawer>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: ${p => p.theme.spacing.medium}px;
`;

const DrawerContent = styled(Stack)`
  flex: 1;
  padding: ${p => p.theme.spacing.medium}px;
`;
