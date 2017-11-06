import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
// import { Layout } from 'react-components-kit';

import ResultViewContainer from './search/resultView.container';
import FilesViewContainer from './files/filesView.container';
import ReportViewContainer from './reports/reportView.container';
import UsersViewContainer from './users/usersView.container';
import OldContainer from './old/vanilla.container';

// const ContentWrapper = styled(Layout.Box)`
//   background-color: #fafafa;
//   padding: 16px 32px 32px 32px;
//   height: 100%;
//   flex: 1;
//   display: flex;
//   overflow-y: auto;
// `;

const StyledMain = styled.main`
  width: 100%;

  > div {
    margin-top: 48px;
  }
`;

const ContentRouter = () => (
  <StyledMain>
    <Route path='/search' component={ResultViewContainer} />
    <Route path='/files' component={FilesViewContainer} />
    <Route path='/reports' component={ReportViewContainer} />
    <Route path='/users' component={UsersViewContainer} />
    <Route path='/old' component={OldContainer} />
  </StyledMain>
);

export default ContentRouter;
