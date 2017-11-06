import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import { Layout } from 'react-components-kit';

// import { Typography } from 'material-ui';

import { common } from './common/common.ducks.js';
import TopBar from './topBar.component';
import SideBar from './sideBar.component';
import ContentRouter from './contentRouter.component';

// const AppWrapper = styled(Layout)`
//   height: 100%;
// `;
//
// const LayoutRow = styled(Layout)`
//   height: 100%;
// `;
//
// const AppContainer = ({ menuVisible, onToggleMenu }) => (
//   <AppWrapper className='App' column='true'>
//     <TopBar onToggleMenu={onToggleMenu} />
//     <LayoutRow>
//       <SideBar menuVisible={menuVisible} />
//       <ContentRouter id='app-content' />
//     </LayoutRow>
//   </AppWrapper>
// );

const AppContainerWrapper = styled.div`
  width: 100%;
  height: 430px;
  margin-top: 24:
  z-index: 1:
  overflow: hidden;
`;

const AppFrameWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

/*
const styles = theme => ({
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    width: '100%',
    marginLeft: -drawerWidth,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64
      }
    }
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  }
});
*/

const AppContainer = ({ menuVisible, onToggleMenu }) => (
  <AppContainerWrapper>
    <AppFrameWrapper>
      <TopBar onToggleMenu={onToggleMenu} />
      <SideBar menuVisible={menuVisible} />
      <ContentRouter id='app-content' />
    </AppFrameWrapper>
  </AppContainerWrapper>
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
