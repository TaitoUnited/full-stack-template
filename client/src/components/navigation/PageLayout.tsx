import { ReactNode } from 'react';

import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { styled } from '~styled-system/jsx';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      <Toolbar />

      <Main>
        <Sidebar />

        <Scroller>
          <div id="breadcrumbs-slot">
            {/* Breadcrumbs are rendered in here via React portal */}
          </div>

          <Content>{children}</Content>
        </Scroller>
      </Main>
    </Layout>
  );
}

const Layout = styled('div', {
  base: {
    position: 'relative',
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$background',

    '@supports (-webkit-touch-callout: none)': {
      height: '-webkit-fill-available',
    },
  },
});

const Main = styled('div', {
  base: {
    flex: 1,
    display: 'flex',
    minHeight: '0px',
  },
});

const Scroller = styled('div', {
  base: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
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
    paddingBlock: '$xlarge',
    paddingInline: '$medium',

    mdDown: {
      padding: '$medium',
    },
    smDown: {
      padding: '$normal',
    },
  },
});
