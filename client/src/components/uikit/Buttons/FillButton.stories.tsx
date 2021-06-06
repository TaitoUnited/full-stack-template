import { FaAtom, FaAward } from 'react-icons/fa';

import type { ButtonProps } from './types';
import Stack from '../Stack';
import FillButton from './FillButton';
import { capitalize } from '~utils/fn';

export default {
  title: 'FillButton',
  component: FillButton,
};

const buttons: NonNullable<ButtonProps['variant']>[] = [
  'primary',
  'info',
  'warn',
  'error',
];

const sizes: NonNullable<ButtonProps['size']>[] = ['small', 'normal', 'large'];

export function AllVariants() {
  return (
    <Stack axis="y" spacing="large">
      {buttons.map(variant => (
        <Stack key={variant} axis="x" spacing="normal" align="flex-start">
          {sizes.map(size => (
            <FillButton
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              onClick={() => console.log('Filled')}
            >
              {`${capitalize(size)} ${variant} `}
            </FillButton>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

export function AllStates() {
  return (
    <Stack axis="y" spacing="large" align="flex-start">
      <Stack axis="x" spacing="normal" align="flex-start">
        {sizes.map(size => (
          <FillButton
            key={`loading-${size}`}
            size={size}
            variant="primary"
            loading
            onClick={() => console.log('Filled')}
          >
            Loading...
          </FillButton>
        ))}
      </Stack>

      <Stack axis="x" spacing="normal" align="flex-start">
        {sizes.map(size => (
          <FillButton
            key={`loading-${size}`}
            size={size}
            variant="primary"
            disabled
            onClick={() => console.log('Filled')}
          >
            Disabled
          </FillButton>
        ))}
      </Stack>
    </Stack>
  );
}

export function WithIcon() {
  return (
    <Stack axis="y" spacing="large" align="flex-start">
      <Stack axis="x" spacing="normal" align="flex-start">
        {sizes.map(size => (
          <FillButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon={FaAtom}
            onClick={() => console.log('Filled')}
          >
            Icon on right
          </FillButton>
        ))}
      </Stack>

      <Stack axis="x" spacing="normal" align="flex-start">
        {sizes.map(size => (
          <FillButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon={FaAward}
            iconPlacement="left"
            onClick={() => console.log('Filled')}
          >
            Icon on left
          </FillButton>
        ))}
      </Stack>
    </Stack>
  );
}
