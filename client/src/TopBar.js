import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const TopBar = ({ onToggleMenu }) => (
  <AppBar position='static'>
    <Toolbar>
      <MenuButton
        aria-label='open drawer'
        color='inherit'
        onClick={() => onToggleMenu()}
      >
        <MenuIcon />
      </MenuButton>
      <Logo color='inherit'>Taito United</Logo>
    </Toolbar>
  </AppBar>
);

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
