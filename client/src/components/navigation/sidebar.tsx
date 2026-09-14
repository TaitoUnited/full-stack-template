import { useLingui } from '@lingui/react/macro';

import { css } from '~/design-system/css';
import { styled } from '~/design-system/jsx';
import { logout, useAuthStore } from '~/stores/auth-store';
import { Button } from '~/uikit/button';
import { Icon, type IconName } from '~/uikit/icon';
import { Stack } from '~/uikit/stack';
import { Text } from '~/uikit/text';
import { toast } from '~/uikit/toaster';

import { Link } from './link';

type Props = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: Props) {
  return (
    <Aside>
      <SidebarContent onNavigate={onNavigate} />
    </Aside>
  );
}

export function SidebarContent({ onNavigate }: Props) {
  const { t } = useLingui();
  const authStatus = useAuthStore(state => state.status);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout', error);
      toast.error(t`Failed to logout`);
    }
  }

  return (
    <Navigation aria-label={t`Navigation`}>
      <NavItem
        icon="homeFilled"
        label={t`Dashboard`}
        to="/"
        onPress={onNavigate}
      />

      <ExampleNavItem
        icon="document"
        label={t`Example page`}
        path="example"
        testId="navigation-example-page"
        onNavigate={onNavigate}
      />

      <ExampleNavItem
        icon="settings"
        label={t`Settings`}
        path="settings"
        testId="navigation-settings"
        onNavigate={onNavigate}
      />

      <NavigationSpacer />
      <Button
        variant="outlined"
        color="primary"
        icon="logout"
        iconPlacement="end"
        isLoading={authStatus === 'logging-out'}
        onPress={() => void handleLogout()}
      >
        {authStatus === 'logging-out' ? t`Logging out` : t`Logout`}
      </Button>
    </Navigation>
  );
}

function NavItem({
  icon,
  label,
  to,
  onPress,
}: {
  icon: IconName;
  label: string;
  to: '/';
  onPress?: () => void;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className={navItemStyles}
      onPress={onPress}
    >
      <Stack direction="row" gap="small" align="center">
        <Icon name={icon} size={20} color="currentColor" />
        <Text variant="bodyBold" as="span">
          {label}
        </Text>
      </Stack>
    </Link>
  );
}

function ExampleNavItem({
  icon,
  label,
  path,
  testId,
  onNavigate,
}: {
  icon: IconName;
  label: string;
  path: string;
  testId: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to="/$"
      params={{ _splat: path }}
      className={navItemStyles}
      data-testid={testId}
      onPress={onNavigate}
    >
      <Stack direction="row" gap="small" align="center">
        <Icon name={icon} size={20} color="currentColor" />
        <Text variant="bodyBold" as="span">
          {label}
        </Text>
      </Stack>
    </Link>
  );
}

const Navigation = styled('nav', {
  base: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '$small',
    flexGrow: 1,
    padding: '$regular',
  },
});

const Aside = styled('aside', {
  base: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$surface',
    borderRightWidth: '1px',
    borderRightColor: '$line3',
    gridColumn: '1',
    gridRow: '2',

    mdDown: { display: 'none' },
  },
});

const navItemStyles = css({
  display: 'block',
  width: '100%',
  color: '$textMuted',
  textDecoration: 'none',
  borderRadius: '$regular',
  padding: '$small',
  outline: 'none',

  '&[data-status="active"]': {
    color: '$primary',
    backgroundColor: '$primaryMuted',
  },
  '&:hover': {
    color: '$text',
    backgroundColor: '$neutral5',
  },
  '&:focus-visible': {
    outline: '2px solid {colors.$focusRing}',
    outlineOffset: '-2px',
  },
});

const NavigationSpacer = styled('div', {
  base: { flexGrow: 1 },
});
