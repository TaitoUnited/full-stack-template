import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Layout } from 'react-components-kit';

import { common } from './common/common.ducks.js';
import TopBar from './topBar.component';
import SideBar from './sideBar.component';
import ContentRouter from './contentRouter.component';

const AppWrapper = styled(Layout)`
  height: 100%;
`;

const LayoutRow = styled(Layout)`
  height: 100%;
`;

const AppContainer = ({ menuVisible, onToggleMenu }) => (
  <AppWrapper className='App' column='true'>
    <TopBar onToggleMenu={onToggleMenu} />
    <LayoutRow>
      <SideBar menuVisible={menuVisible} />
      <ContentRouter id='app-content' />
    </LayoutRow>
  </AppWrapper>
);

function mapStateToProps(state) {
  return {
    menuVisible: state.common.menuVisible
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onToggleMenu: common.toggleMenu
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);
