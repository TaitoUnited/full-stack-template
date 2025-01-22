import { Trans, useLingui } from '@lingui/react/macro';
import { type LinkProps } from '@tanstack/react-router';
import { toast } from 'react-hot-toast';

import { logout, useAuthStore } from '~/services/auth';
import { styled } from '~/styled-system/jsx';
import { stack } from '~/styled-system/patterns';
import { Button } from '~/uikit/button';
import { Icon, type IconName } from '~/uikit/icon';
import { Text } from '~/uikit/text';

import { Link } from './link';

export function Sidebar() {
  const { t } = useLingui();
  const authStatus = useAuthStore(state => state.status);

  const items: Array<{
    label: string;
    icon: IconName;
    to: LinkProps['to'];
    testId: string;
  }> = [
    {
      label: t`Home`,
      icon: 'homeFilled',
      to: '/$workspaceId',
      testId: 'navigate-to-home',
    },
    {
      label: t`Blog`,
      icon: 'document',
      to: '/$workspaceId/posts',
      testId: 'navigate-to-blog',
    },
    {
      label: t`Theming`,
      icon: 'eye',
      to: '/$workspaceId/theming',
      testId: 'navigate-to-theming',
    },
  ];

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
                preload="intent"
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

const NavItemLink = styled(Link, {
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
