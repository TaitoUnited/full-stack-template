import logoImg from '../../images/logo.svg';
import { Stack, Text } from '~uikit';
import { styled } from '~styled-system/jsx';
import LangMenuButton from '~components/common/LangMenuButton';

export default function Toolbar() {
  return (
    <Wrapper>
      <Stack direction="row" gap="regular" align="center">
        <LogoWrapper>
          <LogoImg src={logoImg} />
        </LogoWrapper>

        <Text variant="bodyBold" color="brand">
          Taito Fullstack Template
        </Text>
      </Stack>

      <LangMenuButton />
    </Wrapper>
  );
}

const Wrapper = styled('header', {
  base: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '$regular',
    backgroundColor: '$surface',
    borderBottom: '1px solid',
    borderColor: '$line3',
  },
});

const LogoWrapper = styled('div', {
  base: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$small',
    backgroundColor: '$primaryMuted',
  },
});

const LogoImg = styled('img', {
  base: {
    height: '18px',
    width: 'auto',
  },
});
