import styled from 'styled-components';
import { HiHome, HiBookOpen, HiOutlineSupport, HiLogout } from 'react-icons/hi';
import { t, Trans } from '@lingui/macro';

import { UnstyledLink } from './Link';
import { Text, Icon, Spacer, OutlineButton } from '~uikit';
import { activeOpacity, hoverHighlight } from '~utils/styled';
import { useAuth } from '~services/auth';

export default function Sidebar() {
  const auth = useAuth();

  const items = [
    { label: t`Home`, icon: HiHome, to: '/', testId: 'navigate-to-home' },
    {
      label: t`Blog`,
      icon: HiBookOpen,
      to: '/blog',
      testId: 'navigate-to-blog',
    },
    {
      label: t`Theming`,
      icon: HiOutlineSupport,
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
              <NavItemLink to={to} testId={testId} preloadOn="hover">
                <Icon icon={icon} size={24} color="text" />
                <Spacer axis="x" size="normal" />
                <Text variant="body">{label}</Text>
              </NavItemLink>
            </li>
          ))}

          <div style={{ flex: 1 }} />

          <Logout>
            <OutlineButton
              variant="primary"
              icon={HiLogout}
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
