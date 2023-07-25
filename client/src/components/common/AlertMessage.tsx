import { styled } from '~styled-system/jsx';
import { Stack, Text, Icon } from '~uikit';
import type { IconName } from '~uikit';

export default function AlertMessage({
  variant,
  message,
}: {
  variant: 'info' | 'success' | 'warn' | 'error';
  message: string;
}) {
  const icon: IconName =
    variant === 'info' || variant === 'success'
      ? 'infoFilled'
      : 'warningTriangle';

  return (
    <Wrapper bg={variant}>
      <Stack direction="row" gap="$normal" align="center">
        <Icon name={icon} color={variant} size={24} />
        <Text variant="body" color={`${variant}Text`}>
          {message}
        </Text>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    padding: '$medium',
    borderRadius: '$normal',
  },
  variants: {
    bg: {
      info: { backgroundColor: '$infoMuted' },
      success: { backgroundColor: '$successMuted' },
      warn: { backgroundColor: '$warnMuted' },
      error: { backgroundColor: '$errorMuted' },
    },
  },
});
