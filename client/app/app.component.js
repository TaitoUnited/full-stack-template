import React from 'react';
import styled from 'styled-components';
import { Layout } from 'react-components-kit';

import TopBar from './topBar.component';
import SideBar from './sideBar.component';
import Content from './content.component';

const AppWrapper = styled(Layout)`
  height: 100%;
`;

const LayoutRow = styled(Layout)`
  height: 100%;
`;

const App = ({ actions, appState }) => (
  <AppWrapper className='App' column='true'>
    <TopBar actions={actions} />
    <LayoutRow>
      <SideBar
        menuVisible={appState.menuVisible}
      />
      <Content
        id='app-content'
        actions={actions}
        appState={appState}
      />
    </LayoutRow>
  </AppWrapper>
);

export default App;
