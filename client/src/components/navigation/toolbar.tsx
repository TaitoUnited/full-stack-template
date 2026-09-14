import { useLingui } from '@lingui/react/macro';
import { type ReactNode } from 'react';

import { LangMenuButton } from '~/components/common/lang-menu-button';
import { css } from '~/design-system/css';
import { styled } from '~/design-system/jsx';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';

import logoImg from '../../images/logo.svg';
import { BreadcrumbSlot } from './breadcrumbs';
import { Link } from './link';

export function Toolbar({ children }: { children?: ReactNode }) {
  const { t } = useLingui();

  return (
    <Wrapper>
      <Link to="/" aria-label={t`Dashboard`} className={logoLinkStyles}>
        <LogoWrapper>
          <LogoImg src={logoImg} />
        </LogoWrapper>

        <LogoText variant="bodyBold" color="brand">
          Fullstack Template
        </LogoText>
      </Link>

      <BreadcrumbSlot />

      <Stack direction="row" gap="small" align="center">
        <LangMenuButton />
        {children}
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled('header', {
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '$regular',
    gridColumn: '1 / -1',
    gridRow: '1',
    minHeight: '55px',
    paddingInline: '$medium',
    backgroundColor: '$surface',
    borderBottomWidth: '1px',
    borderBottomColor: '$line3',
    flexShrink: 0,

    smDown: {
      paddingInline: '$regular',
    },
  },
});

const logoLinkStyles = css({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '$regular',
  color: '$text',
  textDecoration: 'none',
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

const LogoText = styled(Text, {
  base: {
    smDown: {
      display: 'none',
    },
  },
});
