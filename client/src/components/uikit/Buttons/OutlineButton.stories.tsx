import type { ButtonProps } from './types';
import { Stack, OutlineButton } from '~uikit';
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
    <Stack direction="column" gap="$large">
      {buttons.map(variant => (
        <Stack key={variant} direction="row" gap="$regular" align="flex-start">
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
    <Stack direction="column" gap="$large" align="flex-start">
      <Stack direction="row" gap="$regular" align="flex-start">
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

      <Stack direction="row" gap="$regular" align="flex-start">
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
    <Stack direction="column" gap="$large" align="flex-start">
      <Stack direction="row" gap="$regular" align="flex-start">
        {sizes.map(size => (
          <OutlineButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon="person"
            onClick={() => console.log('Filled')}
          >
            Icon on right
          </OutlineButton>
        ))}
      </Stack>

      <Stack direction="row" gap="$regular" align="flex-start">
        {sizes.map(size => (
          <OutlineButton
            key={`icon-${size}`}
            size={size}
            variant="primary"
            icon="certificate"
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
