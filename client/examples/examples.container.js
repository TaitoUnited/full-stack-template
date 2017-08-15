import React from 'react';
import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';

import UXContainer from './ux/ux.container';
import UsersContainer from './users/users.container';
import FilesContainer from './files/files.container';
import ReportContainer from './report/report.container';
import SearchContainer from './search/search.container';
import OldContainer from './old/vanilla.container';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow-y: auto;
`;

const RootNaviWrapper = styled.div`
  background-color: #eee;
  padding: 10px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  position: relative;
  @media print {
    display: none;
  }
`;

const ExamplesNaviWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  @media print {
    display: none;
  }
`;

const Content = styled.div`
  padding: 30px;
  flex: 1;
  height: 100vh;
  overflow-y: auto;
`;

const ExamplesContainer = () => (
  <AppWrapper>
    <RootNaviWrapper>
      <ExamplesNaviWrapper>
        <ul>
          <li><Link to='/files'>Files</Link></li>
          <li><Link to='/search'>Search</Link></li>
          <li><Link to='/report'>Report</Link></li>
          <li><Link to='/users'>Users</Link></li>
          <li><Link to='/ux'>UX</Link></li>
        </ul>
        <ul>
          <li><Link to='/old'>Old</Link></li>
        </ul>
      </ExamplesNaviWrapper>
    </RootNaviWrapper>
    <Content id='app-content'>
      <Route path='/ux' component={UXContainer} />
      <Route path='/users' component={UsersContainer} />
      <Route path='/files' component={FilesContainer} />
      <Route path='/report' component={ReportContainer} />
      <Route path='/search' component={SearchContainer} />
      <Route path='/old' component={OldContainer} />
    </Content>
  </AppWrapper>
);

export default ExamplesContainer;
