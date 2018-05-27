import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { common } from './common/ducks.js';
import TopBar from './TopBar';
import SideBar from './SideBar';
import ContentRouter from './ContentRouter';

const App = ({ menuVisible, onToggleMenu }) => (
  <div>
    <CssBaseline />
    <TopBar onToggleMenu={onToggleMenu} />
    <SideBar menuVisible={menuVisible} onToggleMenu={onToggleMenu} />
    <ContentRouter menuVisible={menuVisible} id='app-content' />
  </div>
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

export default withTheme()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
);
