import React from 'react';
import styled from 'styled-components';

import SideBar from './sideBar.component';
import Content from './content.component';

// import { Layout } from 'react-components-kit';
//
// const AppWrapper = styled(Layout)`
//   background-color: blue;
// `;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow-y: auto;
`;

const App = () => (
  <AppWrapper className='App'>
    <SideBar />
    <Content id='app-content' />
  </AppWrapper>
);

export default App;
