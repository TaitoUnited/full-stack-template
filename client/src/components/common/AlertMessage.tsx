import styled from 'styled-components';
import { HiExclamation, HiExclamationCircle } from 'react-icons/hi';

import { Stack, Text, Icon } from '~uikit';
import type { Color } from '~constants/theme';

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
  const icon = variant === 'info' ? HiExclamationCircle : HiExclamation;

  return (
    <Wrapper bg={bg}>
      <Stack axis="x" spacing="normal" align="center">
        <Icon icon={icon} color={iconColor} size="normal" />
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
