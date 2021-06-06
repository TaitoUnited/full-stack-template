import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useOverlayTriggerState } from 'react-stately';

import Text from '../Text';
import Stack from '../Stack';
import FillButton from '../Buttons/FillButton';
import Modal from './index';
import OutlineButton from '../Buttons/OutlineButton';

export default {
  title: 'Modal',
  component: Modal,
};

// NOTE: for some reason Storybook breaks if you use hooks inside the story component...
export function Example() {
  return <ModalExample />;
}

function ModalExample() {
  const state = useOverlayTriggerState({});

  return (
    <Wrapper>
      <FillButton variant="primary" onClick={() => state.open()}>
        Open modal
      </FillButton>

      <AnimatePresence>
        {state.isOpen && (
          <Modal onClose={state.close} title="Example modal">
            <ModalContent
              axis="y"
              spacing="large"
              align="center"
              justify="space-between"
            >
              <Text variant="title3" aria-hidden>
                Example modal
              </Text>

              <Text variant="body" lineHeight={1.5}>
                Branding product management partner network advisor equity
                monetization sales business-to-consumer buzz facebook client
                ecosystem. IPhone technology angel investor analytics responsive
                web design pivot stock user experience creative leverage
                conversion interaction design branding. Business-to-consumer
                customer mass market buyer ecosystem startup advisor incubator
                bandwidth.
              </Text>

              <OutlineButton variant="info" onClick={() => state.close()}>
                Close
              </OutlineButton>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: ${p => p.theme.spacing.medium}px;
`;

const ModalContent = styled(Stack)`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  padding: ${p => p.theme.spacing.medium}px;
`;
