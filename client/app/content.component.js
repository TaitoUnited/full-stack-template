import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from 'react-components-kit';

import SearchContainer from './search/search.container';
import ReportsContainer from './reports/reports.container';
import FilesContainer from './files/files.container';
import UsersContainer from './users/users.container';
import UXContainer from './ux/ux.container';
import OldContainer from './old/vanilla.container';

const ContentWrapper = styled(Layout.Box)`
  padding: 30px;
  height: 100%;
  flex: 1;
  display: flex;
  overflow-y: auto;
`;

const Content = ({ actions, appState }) => (
  <ContentWrapper className='Content' id='app-content'>
    <Route
      exact
      path='/search' render={() => (
        <SearchContainer actions={actions} appState={appState} />
      )}
    />
    <Route
      exact
      path='/reports' render={() => (
        <ReportsContainer actions={actions} appState={appState} />
      )}
    />
    <Route
      exact
      path='/files' render={() => (
        <FilesContainer actions={actions} appState={appState} />
      )}
    />
    <Route
      exact
      path='/users' render={() => (
        <UsersContainer actions={actions} appState={appState} />
      )}
    />
    <Route
      exact
      path='/ux' render={() => (
        <UXContainer actions={actions} appState={appState} />
      )}
    />

    <Route path='/old' component={OldContainer} />
  </ContentWrapper>
);

export default Content;
