import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styled from 'styled-components';

import { navigation } from './navigation.model';

interface Props {
  toggleMenu: (visible?: boolean) => any;
  menuVisible: boolean;
}

const SideBar = ({ menuVisible, toggleMenu }: Props) => (
  <SwipeableDrawer
    open={menuVisible}
    onOpen={() => toggleMenu(true)}
    onClose={() => toggleMenu(false)}
  >
    <Content>
      <List>
        <NaviLink
          to="/posts"
          data-test="navigate-to-posts"
          onClick={() => toggleMenu()}
        >
          <ListItem button>
            <ListItemText primary="Posts" />
          </ListItem>
        </NaviLink>
        <NaviLink
          to="/settings"
          data-test="navigate-to-settings"
          onClick={() => toggleMenu()}
        >
          <ListItem button>
            <ListItemText primary="Settings" />
          </ListItem>
        </NaviLink>
        <AnchorLink
          href="/admin/"
          data-test="navigate-to-admin"
          onClick={() => toggleMenu()}
        >
          <ListItem button>
            <ListItemText primary="Admin GUI" />
          </ListItem>
        </AnchorLink>
      </List>
    </Content>
  </SwipeableDrawer>
);

const Content = styled.div`
  width: 240px;
  padding: ${props => props.theme.spacing(3)}px 0;
`;

const NaviLink = styled(Link)`
  display: block;
  text-decoration: none;
`;

const AnchorLink = styled.a`
  text-decoration: none;
`;

export default connect(
  (state: any) => ({
    menuVisible: state.navigation.menuVisible, // TODO: maybe use selector
  }),
  {
    toggleMenu: navigation.actions.toggleMenu,
  }
)(SideBar);
