import { ComponentProps } from 'react';
import { HiAcademicCap, HiCamera, HiEmojiHappy } from 'react-icons/hi';

import Stack from '../Stack';
import FloatingButton from './FloatingButton';

export default {
  title: 'FloatingButton',
  component: FloatingButton,
};

type Variant = ComponentProps<typeof FloatingButton>['variant'];

const buttons: Variant[] = ['primary', 'info'];

export function AllVariants() {
  return (
    <Stack axis="x" spacing="large">
      {buttons.map(variant => (
        <Stack key={variant} axis="x" spacing="normal" align="flex-start">
          <FloatingButton
            icon={HiAcademicCap}
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
    <Stack axis="y" spacing="large" align="flex-start">
      <Stack axis="x" spacing="normal" align="flex-start">
        <FloatingButton
          icon={HiCamera}
          variant="primary"
          loading
          onClick={() => console.log('Filled')}
          label="Loading..."
          tooltipPosition="right"
        />

        <FloatingButton
          icon={HiEmojiHappy}
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
