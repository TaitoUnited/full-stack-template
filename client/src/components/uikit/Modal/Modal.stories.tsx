import { AnimatePresence } from 'framer-motion';
import { useOverlayTriggerState } from 'react-stately';

import { css } from '~styled-system/css';
import { styled } from '~styled-system/jsx';
import { Stack, Modal, Text, FillButton, OutlineButton } from '~uikit';

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
            <Stack
              direction="column"
              gap="$large"
              align="center"
              justify="space-between"
              className={modalContentStyles}
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
            </Stack>
          </Modal>
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

const modalContentStyles = css({
  flex: 1,
  minWidth: '300px',
  maxWidth: '500px',
  padding: '$medium',
});
