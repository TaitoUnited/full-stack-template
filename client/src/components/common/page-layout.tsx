import { useLingui } from '@lingui/react/macro';
import { type ReactNode, useState } from 'react';

import { styled } from '~/design-system/jsx';
import { IconButton } from '~/uikit/icon-button';

import { MobileSidebar } from '../navigation/mobile-sidebar';
import { Sidebar } from '../navigation/sidebar';
import { Toolbar } from '../navigation/toolbar';

export function PageLayout({ children }: { children: ReactNode }) {
  const { t } = useLingui();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Layout data-testid="page-layout">
      <Topbar data-page-layout-slot="topbar" data-testid="page-topbar">
        <Toolbar>
          <MobileNavigationToggle>
            <IconButton
              icon="menu"
              label={t`Open navigation`}
              onPress={() => setMobileNavOpen(true)}
            />
          </MobileNavigationToggle>
        </Toolbar>
      </Topbar>

      <MobileSidebar isOpen={isMobileNavOpen} onOpenChange={setMobileNavOpen} />
      <Sidebar />

      <ContentScroller>
        <Content data-testid="page-content">{children}</Content>
      </ContentScroller>
    </Layout>
  );
}

const Layout = styled('div', {
  base: {
    height: '100dvh',
    width: '100%',
    backgroundColor: '$neutral5',
    display: 'grid',
    gridTemplateColumns: '240px minmax(0, 1fr)',
    gridTemplateRows: 'auto minmax(0, 1fr)',
    overflow: 'hidden',

    mdDown: {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
});

const Topbar = styled('div', {
  base: {
    gridColumn: '1 / -1',
    gridRow: '1',
    zIndex: 1,
  },
});

const MobileNavigationToggle = styled('div', {
  base: {
    display: 'none',
    mdDown: {
      display: 'block',
    },
  },
});

const ContentScroller = styled('div', {
  base: {
    gridColumn: '2',
    gridRow: '2',
    minWidth: 0,
    minHeight: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    $customScrollbar: true,
    // Ensure the width doesn't jump around when the scrollbar appears/disappears
    scrollbarGutter: 'stable both-edges',

    mdDown: {
      gridColumn: '1',
    },
  },
});

const Content = styled('main', {
  base: {
    position: 'relative',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1000px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBlock: '$xl',
    paddingInline: '$medium',

    mdDown: {
      padding: '$medium',
    },
    smDown: {
      padding: '$regular',
    },
  },
});
