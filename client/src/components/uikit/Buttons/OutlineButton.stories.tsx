import { FaAtom, FaAward } from 'react-icons/fa';

import type { ButtonProps } from './types';
import Stack from '../Stack';
import OutlineButton from './OutlineButton';
import { capitalize } from '~utils/fn';

export default {
  title: 'OutlineButton',
  component: OutlineButton,
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
            <OutlineButton
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              onClick={() => console.log('Filled')}
            >
              {`${capitalize(size)} ${variant} `}
            </OutlineButton>
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
          <OutlineButton
            key={`loading-${size}`}
            size={size}
            variant="primary"
            loading
            onClick={() => console.log('Filled')}
          >
            Loading...
          </OutlineButton>
        ))}
      </Stack>

      <Stack axis="x" spacing="normal" align="flex-start">
        {sizes.map(size => (
          <OutlineButton
            key={`loading-${size}`}
            size={size}
            variant="primary"
            disabled
            onClick={() => console.log('Filled')}
          >
            Disabled
          </OutlineButton>
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
          <OutlineButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon={FaAtom}
            onClick={() => console.log('Filled')}
          >
            Icon on right
          </OutlineButton>
        ))}
      </Stack>

      <Stack axis="x" spacing="normal" align="flex-start">
        {sizes.map(size => (
          <OutlineButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon={FaAward}
            iconPlacement="left"
            onClick={() => console.log('Filled')}
          >
            Icon on left
          </OutlineButton>
        ))}
      </Stack>
    </Stack>
  );
}
