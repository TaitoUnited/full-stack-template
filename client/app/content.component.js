import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
// import { Layout } from 'react-components-kit';

import UXContainer from './ux/ux.container';
import UsersContainer from './users/users.container';
import FilesContainer from './files/files.container';
import ReportContainer from './report/report.container';
import SearchContainer from './search/search.container';
import OldContainer from './old/vanilla.container';

// const ContentWrapper = styled(Layout)`
//   background-color: blue;
// `;

const ContentWrapper = styled.div`
  padding: 30px;
  flex: 1;
  height: 100vh;
  overflow-y: auto;
`;

/*
*/

const Content = () => (
  <ContentWrapper className='Content' id='app-content'>
    <Route path='/files' component={FilesContainer} />
    <Route path='/search' component={SearchContainer} />
    <Route path='/report' component={ReportContainer} />
    <Route path='/users' component={UsersContainer} />
    <Route path='/ux' component={UXContainer} />
    <Route path='/old' component={OldContainer} />
  </ContentWrapper>
);

export default Content;
