import React from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, IconButton, Button } from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';

import BasicSearchContainer from './search/basicSearch.container';

const StyledAppBar = styled(AppBar).attrs({
  color: 'primary'
})`
  background-color: white;
  > div {
    min-height: 48px;
  }
`;

const MenuButton = styled(IconButton)`
  margin-left: -16px;
`;

const Logo = styled.div`
  width: 96px;
  height: 18px;
  margin: 0 40px 0 16px;
  vertical-align: middle;
  cursor: pointer;
  background-image: url('http://www.taitounited.fi/img/logo_vihrea_li.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;

  @media (max-width: 640px) {
    display: none;
  }
`;

const TopBar = ({ onToggleMenu }) => (
  <StyledAppBar>
    <Toolbar>
      <MenuButton
        color='contrast'
        aria-label='open drawer'
        onClick={() => onToggleMenu()}
      >
        <MenuIcon />
      </MenuButton>
      <Logo />
      <BasicSearchContainer />
      <Button color='contrast'>Login</Button>
    </Toolbar>
  </StyledAppBar>
);

export default TopBar;
