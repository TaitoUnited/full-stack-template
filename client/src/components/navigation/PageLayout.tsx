import { ReactNode } from 'react';
import styled from 'styled-components';

import Sidebar from './Sidebar';
import Toolbar from './Toolbar';

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

const Layout = styled.div`
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.colors.background};

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  min-height: 0px;
`;

const Scroller = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Content = styled.main`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding: ${p => p.theme.spacing.xlarge}px ${p => p.theme.spacing.medium}px;

  ${p => p.theme.media.tablet} {
    padding: ${p => p.theme.spacing.medium}px;
  }

  ${p => p.theme.media.phone} {
    padding: ${p => p.theme.spacing.normal}px;
  }
`;
