import { Trans, useLingui } from '@lingui/react/macro';

import { toast } from 'react-hot-toast';
import { UnstyledLink } from './Link';
import { Text, Icon, IconName, Button } from '~uikit';
import { styled } from '~styled-system/jsx';
import { logout, useAuthStore } from '~services/auth';
import { stack } from '~styled-system/patterns';
import { isFeatureEnabled } from '~services/feature-flags';

export function Sidebar() {
  const { t } = useLingui();
  const authStatus = useAuthStore(state => state.status);
  const feature3Enabled = isFeatureEnabled('feature-3');

  const items: Array<{
    label: string;
    icon: IconName;
    to: string;
    testId: string;
  }> = [
    {
      label: t`Home`,
      icon: 'homeFilled',
      to: '/',
      testId: 'navigate-to-home',
    },
    {
      label: t`Blog`,
      icon: 'document',
      to: '/blog',
      testId: 'navigate-to-blog',
    },
    {
      label: t`Theming`,
      icon: 'eye',
      to: '/theming',
      testId: 'navigate-to-theming',
    },
  ];

  if (feature3Enabled) {
    items.push({
      label: t`Feature Flags`,
      icon: 'save',
      to: '/feature-flags',
      testId: 'navigate-to-feature-flags',
    });
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout', error);
      toast(t`Failed to logout`, { icon: 'error' });
    }
  }

  return (
    <Wrapper>
      <Nav>
        <NavList>
          {items.map(({ label, icon, to, testId }) => (
            <li key={label}>
              <NavItemLink
                to={to}
                data-testid={testId}
                className={stack({ direction: 'row', gap: '$small' })}
                preload // preload route on mouse down
              >
                <Icon name={icon} size={24} color="text" />
                <Text variant="body">{label}</Text>
              </NavItemLink>
            </li>
          ))}

          <div style={{ flex: 1 }} />

          <Logout>
            <Button
              variant="outlined"
              color="primary"
              icon="logout"
              iconPlacement="end"
              isLoading={authStatus === 'logging-out'}
              onPress={handleLogout}
            >
              {authStatus === 'logging-out' ? (
                <Trans>Logging out</Trans>
              ) : (
                <Trans>Logout</Trans>
              )}
            </Button>
          </Logout>
        </NavList>
      </Nav>
    </Wrapper>
  );
}

const Wrapper = styled('aside', {
  base: {
    minWidth: '300px',
    backgroundColor: '$surface',
    borderRight: '1px solid $line3',
  },
});

const Nav = styled('nav', {
  base: {
    height: '100%',
  },
});

const NavList = styled('ul', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '$xs',
  },
});

const NavItemLink = styled(UnstyledLink, {
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: '$text',
    padding: '$regular',
    borderRadius: '$small',
    $hoverHighlight: true,
    $pressOpacity: true,
  },
});

const Logout = styled('li', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    padding: '$regular',
  },
});
