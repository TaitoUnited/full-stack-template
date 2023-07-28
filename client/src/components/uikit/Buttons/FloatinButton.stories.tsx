import { ComponentProps } from 'react';
import { Stack, FloatingButton } from '~uikit';

export default {
  title: 'FloatingButton',
  component: FloatingButton,
};

type Variant = ComponentProps<typeof FloatingButton>['variant'];

const buttons: Variant[] = ['primary', 'info'];

export function AllVariants() {
  return (
    <Stack direction="row" gap="$large">
      {buttons.map(variant => (
        <Stack key={variant} direction="row" gap="$normal" align="flex-start">
          <FloatingButton
            icon="bell"
            variant={variant}
            onClick={() => console.log('Filled')}
            label="Example"
            tooltipPosition="right"
          />
        </Stack>
      ))}
    </Stack>
  );
}

export function AllStates() {
  return (
    <Stack direction="column" gap="$large" align="flex-start">
      <Stack direction="row" gap="$normal" align="flex-start">
        <FloatingButton
          icon="clock"
          variant="primary"
          loading
          onClick={() => console.log('Filled')}
          label="Loading..."
          tooltipPosition="right"
        />

        <FloatingButton
          icon="heartFilled"
          variant="primary"
          disabled
          onClick={() => console.log('Filled')}
          label="Disabled"
          tooltipPosition="right"
        />
      </Stack>
    </Stack>
  );
}
