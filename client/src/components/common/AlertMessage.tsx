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
    variant === 'info' || variant === 'success' ? 'info' : 'warning';

  return (
    <Wrapper bg={variant}>
      <Stack direction="row" gap="$regular" align="center">
        <Icon name={icon} color={variant} size={24} />
        <Text variant="body" color={`${variant}Contrast`}>
          {message}
        </Text>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    padding: '$medium',
    borderRadius: '$regular',
    borderWidth: '1px',
  },
  variants: {
    bg: {
      info: {
        backgroundColor: '$infoMuted',
        borderColor: '$info',
      },
      success: {
        backgroundColor: '$successMuted',
        borderColor: '$success',
      },
      warn: {
        backgroundColor: '$warnMuted',
        borderColor: '$warn',
      },
      error: {
        backgroundColor: '$errorMuted',
        borderColor: '$error',
      },
    },
  },
});
