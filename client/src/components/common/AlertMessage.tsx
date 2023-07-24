import styled from 'styled-components';

import { Stack, Text, Icon } from '~uikit';
import type { Color } from '~constants/theme';
import type { IconName } from '~uikit';

export default function AlertMessage({
  variant,
  message,
}: {
  variant: 'info' | 'success' | 'warn' | 'error';
  message: string;
}) {
  const bg = `${variant}Muted` as Color;
  const textColor = `${variant}Text` as Color;
  const iconColor = variant as Color;
  const icon: IconName =
    variant === 'info' || variant === 'success'
      ? 'infoFilled'
      : 'warningTriangle';

  return (
    <Wrapper bg={bg}>
      <Stack direction="row" gap="$normal" align="center">
        <Icon name={icon} color={iconColor} size={24} />
        <Text variant="body" color={textColor}>
          {message}
        </Text>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ bg: Color }>`
  padding: ${p => p.theme.spacing.medium}px;
  border-radius: ${p => p.theme.radii.normal}px;
  background-color: ${p => p.theme.colors[p.bg]};
`;
