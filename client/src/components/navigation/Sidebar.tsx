import styled from 'styled-components';
import { t, Trans } from '@lingui/macro';

import { UnstyledLink } from './Link';
import { Text, Icon, OutlineButton, IconName } from '~uikit';
import { activeOpacity, hoverHighlight } from '~utils/styled';
import { useAuth } from '~services/auth';
import { hstack } from '~styled-system/patterns';

export default function Sidebar() {
  const auth = useAuth();

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
                className={hstack({ gap: 'small' })}
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

const Wrapper = styled.aside`
  min-width: 300px;
  background-color: ${p => p.theme.colors.surface};
  border-right: 1px solid ${p => p.theme.colors.border};
`;

const Nav = styled.nav`
  height: 100%;
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NavItemLink = styled(UnstyledLink)`
  position: relative;
  display: flex;
  align-items: center;
  color: ${p => p.theme.colors.text};
  padding: ${p => p.theme.spacing.normal}px;
  ${hoverHighlight}
  ${activeOpacity}
`;

const Logout = styled.li`
  display: flex;
  flex-direction: column;
  padding: ${p => p.theme.spacing.normal}px;
`;
