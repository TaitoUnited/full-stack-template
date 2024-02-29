import Button, { buttonStyle, type ButtonProps } from './Button';
import { Stack } from '~styled-system/jsx';
import { Text } from '~uikit';

export default {
  title: 'Button',
  component: Button,
};

const colors = ['primary', 'success', 'error'] as const;

export const Variants = {
  render: (args: ButtonProps) => (
    <Stack gap="$normal">
      {colors.map(color => {
        return (
          <>
            <Text variant="title2">{color}</Text>
            <Stack direction="row" gap="$normal" key={color}>
              {buttonStyle.variantMap.variant.map(variant => {
                return (
                  <Button
                    {...args}
                    key={variant}
                    variant={variant}
                    color={color}
                  >
                    Button Text
                  </Button>
                );
              })}
            </Stack>
          </>
        );
      })}
    </Stack>
  ),
};
