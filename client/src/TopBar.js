import React from 'react';
import styled from 'styled-components';
import {
  AppBar, Toolbar, IconButton, Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const TopBar = ({ onToggleMenu }) => (
  <StyledAppBar position='static'>
    <Toolbar>
      <MenuButton
        data-test='open-left-drawer'
        aria-label='open left drawer'
        color='inherit'
        onClick={() => onToggleMenu()}
      >
        <MenuIcon />
      </MenuButton>
      <Logo color='inherit'>Taito United</Logo>
    </Toolbar>
  </StyledAppBar>
);

const StyledAppBar = styled(AppBar)`
  @media print {
    display: none !important;
  }
`;

const MenuButton = styled(IconButton)`
  && {
    margin-left: -12px;
    margin-right: 20px;
  }
`;

const Logo = styled(Typography)`
  && {
    margin-top: 2px;
    margin-left: -4px;
    font-size: 16px;
    text-transform: uppercase;
  }
`;

export default TopBar;
