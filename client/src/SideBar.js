import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';

/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO remove anchor-is-valid (was introduced in eslint upgrade)

const SideBar = ({ menuVisible, onToggleMenu }) => (
  <SwipeableDrawer
    type='persistent'
    open={menuVisible}
    onOpen={() => onToggleMenu(true)}
    onClose={() => onToggleMenu(false)}
  >
    <Content>
      <List>
        <NaviLink to='/search' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Search' />
          </ListItem>
        </NaviLink>
        <NaviLink to='/posts' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Posts' />
          </ListItem>
        </NaviLink>
        <NaviLink to='/images' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Images' />
          </ListItem>
        </NaviLink>
        <NaviLink to='/reports' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Reports' />
          </ListItem>
        </NaviLink>
        <NaviLink to='/layouts' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Layouts and animations' />
          </ListItem>
        </NaviLink>
        <AnchorLink href='/admin/' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Admin GUI' />
          </ListItem>
        </AnchorLink>
      </List>
    </Content>
  </SwipeableDrawer>
);

const Content = withTheme()(styled.div`
  width: 240px;
  padding: ${props => props.theme.spacing.unit * 3}px 0;
`);

const NaviLink = styled(Link)`
  text-decoration: none;
`;

const AnchorLink = styled.a`
  text-decoration: none;
`;

export default SideBar;
