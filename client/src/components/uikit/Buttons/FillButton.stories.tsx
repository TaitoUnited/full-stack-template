import type { ButtonProps } from './types';
import { Stack, FillButton } from '~uikit';
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
    <Stack direction="column" gap="$large">
      {buttons.map(variant => (
        <Stack key={variant} direction="row" gap="$normal" align="flex-start">
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
    <Stack direction="column" gap="$large" align="flex-start">
      <Stack direction="row" gap="$normal" align="flex-start">
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

      <Stack direction="row" gap="$normal" align="flex-start">
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
    <Stack direction="column" gap="$large" align="flex-start">
      <Stack direction="row" gap="$normal" align="flex-start">
        {sizes.map(size => (
          <FillButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon="sparkles"
            onClick={() => console.log('Filled')}
          >
            Icon on right
          </FillButton>
        ))}
      </Stack>

      <Stack direction="row" gap="$normal" align="flex-start">
        {sizes.map(size => (
          <FillButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon="bell"
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
