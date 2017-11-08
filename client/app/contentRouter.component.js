import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { withTheme } from 'material-ui/styles';

import ResultViewContainer from './search/resultView.container';
import FilesViewContainer from './files/filesView.container';
import ReportViewContainer from './reports/reportView.container';
import UsersViewContainer from './users/usersView.container';
import OldContainer from './old/vanilla.container';

const StyledMain = styled.main`
  width: 100%;
  height: 'calc(100% - 48px)';
  margin-top: 48px;
  margin-left: ${props => (props.menuVisible ? '224px' : '0')};
  transition-property: margin;
  transition-duration: ${props =>
    props.menuVisible
      ? props.theme.transitions.duration.enteringScreen
      : props.theme.transitions.duration.leavingScreen};
  transition-timing-function: ${props =>
    props.menuVisible
      ? props.theme.transitions.easing.easeOut
      : props.theme.transitions.easing.sharp};
`;

const ContentRouter = ({ menuVisible, theme }) => (
  <StyledMain menuVisible={menuVisible} theme={theme}>
    <Route path='/search' component={ResultViewContainer} />
    <Route path='/files' component={FilesViewContainer} />
    <Route path='/reports' component={ReportViewContainer} />
    <Route path='/users' component={UsersViewContainer} />
    <Route path='/old' component={OldContainer} />
  </StyledMain>
);

export default withTheme()(ContentRouter);
