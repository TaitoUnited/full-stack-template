import { t, Trans } from '@lingui/macro';

import { UnstyledLink } from './Link';
import { Text, Icon, OutlineButton, IconName } from '~uikit';
import { styled } from '~styled-system/jsx';
import { useAuth } from '~services/auth';
import { stack } from '~styled-system/patterns';
import { isFeatureEnabled } from '~utils/feature-flags';

export default function Sidebar() {
  const auth = useAuth();
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
      icon: 'book',
      to: '/blog',
      testId: 'navigate-to-blog',
    },
    {
      label: t`Theming`,
      icon: 'lightningFilled',
      to: '/theming',
      testId: 'navigate-to-theming',
    },
  ];

  if (feature3Enabled) {
    items.push({
      label: t`Feature Flags`,
      icon: 'commandLineFilled',
      to: '/feature-flags',
      testId: 'navigate-to-feature-flags',
    });
  }

  return (
    <Wrapper>
      <Nav>
        <NavList>
          {items.map(({ label, icon, to, testId }) => (
            <li key={label}>
              <NavItemLink
                to={to}
                data-test-id={testId}
                preloadOn="hover"
                className={stack({ direction: 'row', gap: '$small' })}
              >
                <Icon name={icon} size={24} color="text" />
                <Text variant="body">{label}</Text>
              </NavItemLink>
            </li>
          ))}

          <div style={{ flex: 1 }} />

          <Logout>
            <OutlineButton
              variant="primary"
              icon="logout"
              loading={auth.status === 'logging-out'}
              onClick={auth.logout}
            >
              {auth.status === 'logging-out' ? (
                <Trans>Logging out</Trans>
              ) : (
                <Trans>Logout</Trans>
              )}
            </OutlineButton>
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
    borderRight: '1px solid $border',
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
  },
});

const NavItemLink = styled(UnstyledLink, {
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: '$text',
    padding: '$normal',
    $hoverHighlight: '',
    $pressOpacity: '',
  },
});

const Logout = styled('li', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    padding: '$normal',
  },
});
