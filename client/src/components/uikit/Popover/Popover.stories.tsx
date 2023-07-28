import { useRef } from 'react';
import { useOverlayTriggerState } from 'react-stately';
import { useOverlayTrigger, useOverlayPosition } from 'react-aria';

import { Stack, Text, FillButton, Popover } from '~uikit';

export default {
  title: 'Popover',
  component: Popover,
};

export function Example() {
  return <PopoverExample />;
}

function PopoverExample() {
  const state = useOverlayTriggerState({});
  const triggerRef = useRef<any>();
  const overlayRef = useRef<any>();

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  );

  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'top',
    offset: 8,
    isOpen: state.isOpen,
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '600px',
      }}
    >
      <FillButton
        variant="primary"
        {...triggerProps}
        ref={triggerRef}
        onClick={() => state.open()}
      >
        Open popover
      </FillButton>

      {state.isOpen && (
        <Popover
          {...overlayProps}
          {...positionProps}
          ref={overlayRef}
          onClose={state.close}
          title="Example popover"
        >
          <Stack
            direction="column"
            gap="$small"
            style={{ padding: 24, maxWidth: 300 }}
          >
            <Text variant="body">Popover content here</Text>
            <Text variant="bodySmall" lineHeight={1.6}>
              Funding business plan rockstar. Android customer creative
              hypotheses marketing non-disclosure agreement twitter. IPad launch
              party funding ramen seed money advisor rockstar influencer burn
              rate MVP.
            </Text>
          </Stack>
        </Popover>
      )}
    </div>
  );
}
