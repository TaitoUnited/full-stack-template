import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { common } from './common/common.ducks.js';
import TopBar from './topBar.component';
import SideBar from './sideBar.component';
import ContentRouter from './contentRouter.component';

const StyledWrapper = styled.div`
  width: 100%;
  height: 430px;
  margin-top: 24:
  z-index: 1:
  overflow: hidden;
`;

const StyledInnerWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

const AppContainer = ({ menuVisible, onToggleMenu }) => (
  <StyledWrapper>
    <StyledInnerWrapper>
      <TopBar onToggleMenu={onToggleMenu} />
      <SideBar menuVisible={menuVisible} />
      <ContentRouter menuVisible={menuVisible} id='app-content' />
    </StyledInnerWrapper>
  </StyledWrapper>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppContainer)
);
