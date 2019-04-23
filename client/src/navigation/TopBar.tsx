import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import styled from 'styled-components';

import { navigation } from './navigation.model';

interface Props {
  toggleMenu: (visible?: boolean) => any;
}

const TopBar = ({ toggleMenu }: Props) => (
  <StyledAppBar position="static">
    <Toolbar>
      <MenuButton
        data-test="open-left-drawer"
        aria-label="open left drawer"
        color="inherit"
        onClick={() => toggleMenu()}
      >
        <MenuIcon />
      </MenuButton>
      <Logo color="inherit">Taito United</Logo>
    </Toolbar>
  </StyledAppBar>
);

const StyledAppBar = styled(AppBar)<any>`
  @media print {
    display: none !important;
  }
`;

const MenuButton = styled(IconButton)<any>`
  && {
    margin-left: -12px;
    margin-right: 20px;
  }
`;

const Logo = styled(Typography)<any>`
  && {
    margin-top: 2px;
    margin-left: -4px;
    font-size: 16px;
    text-transform: uppercase;
  }
`;

export default connect(
  undefined,
  {
    toggleMenu: navigation.actions.toggleMenu,
  }
)(TopBar);
