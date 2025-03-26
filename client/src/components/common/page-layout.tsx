import { type ReactNode } from 'react';

import { styled } from '~/styled-system/jsx';

import { Sidebar } from '../navigation/sidebar';
import { Toolbar } from '../navigation/toolbar';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Layout data-testid="page-layout">
      <Topbar data-page-layout-slot="topbar" data-testid="page-topbar">
        <Toolbar />
      </Topbar>

      <LeftAside
        data-page-layout-slot="left-aside"
        data-testid="page-left-aside"
      >
        <Sidebar />
      </LeftAside>

      <ContentScroller>
        <Content data-testid="page-content">{children}</Content>
      </ContentScroller>

      <RightAside
        data-page-layout-slot="right-aside"
        data-testid="page-right-aside"
      />

      <Footer data-page-layout-slot="footer" data-testid="page-footer" />
    </Layout>
  );
}

const Layout = styled('div', {
  base: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    backgroundColor: '$neutral5',
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateAreas: `
      'sidebar topbar topbar topbar'
      'sidebar left-aside content right-aside'
      'sidebar footer footer footer'
    `,
  },
});

const Topbar = styled('div', {
  base: {
    gridArea: 'topbar',
    zIndex: 1,
  },
});

const LeftAside = styled('aside', {
  base: {
    gridArea: 'left-aside',
  },
});

const RightAside = styled('aside', {
  base: {
    gridArea: 'right-aside',
  },
});

const Footer = styled('footer', {
  base: {
    gridArea: 'footer',
    zIndex: 1,
  },
});

const ContentScroller = styled('div', {
  base: {
    gridArea: 'content',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    $customScrollbar: true,
    // Ensure the width doesn't jump around when the scrollbar appears/disappears
    scrollbarGutter: 'stable both-edges',
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
