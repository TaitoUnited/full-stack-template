import styled from 'styled-components';

import logoImg from '../../images/logo.svg';
import { flexCenter } from '~utils/styled';
import { Stack, Text } from '~uikit';
import ColorModeButton from '~components/common/ColorModeButton';
import LangMenuButton from '~components/common/LangMenuButton';

export default function Toolbar() {
  return (
    <Wrapper>
      <Stack axis="x" spacing="normal" align="center">
        <LogoWrapper>
          <LogoImg src={logoImg} />
        </LogoWrapper>

        <Text variant="bodyStrong" color="primary">
          Taito Fullstack Template
        </Text>
      </Stack>

      <Stack axis="x" spacing="normal" align="center">
        <ColorModeButton />
        <LangMenuButton />
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${p => p.theme.spacing.normal}px;
  background-color: ${p => p.theme.colors.surface};
  border-bottom: 1px solid ${p => p.theme.colors.border};
`;

const LogoWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${p => p.theme.radii.small}px;
  background-color: ${p => p.theme.colors.primaryMuted};
  ${flexCenter}
`;

const LogoImg = styled.img`
  height: 18px;
  width: auto;
`;
