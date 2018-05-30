import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './common/theme';
import { common } from './common/ducks';

import TopBar from './TopBar';
import SideBar from './SideBar';
import Router from './Router';

const App = ({ menuVisible, onToggleMenu }) => (
  <MuiThemeProvider theme={theme}>
    <StyledWrapper>
      <CssBaseline />
      <TopBar onToggleMenu={onToggleMenu} />
      <SideBar menuVisible={menuVisible} onToggleMenu={onToggleMenu} />
      <Router menuVisible={menuVisible} id='app-content' />
    </StyledWrapper>
  </MuiThemeProvider>
);

const mapStateToProps = state => {
  return {
    menuVisible: state.common.menuVisible
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      onToggleMenu: common.toggleMenu
    },
    dispatch
  );
};

const StyledWrapper = styled.div`
  @media print {
    margin-top: 0;
    button {
      display: none !important;
    }
  }
`;

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
