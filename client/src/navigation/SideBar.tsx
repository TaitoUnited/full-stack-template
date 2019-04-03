import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';

import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import styled from '~styled';
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
          to="/settings"
          data-test="navigate-to-settings"
          onClick={() => toggleMenu()}
        >
          <ListItem button>
            <ListItemText primary="Settings" />
          </ListItem>
        </NaviLink>
        <NaviLink
          to="/orders"
          data-test="navigate-to-orders"
          onClick={() => toggleMenu()}
        >
          <ListItem button>
            <ListItemText primary="Orders" />
          </ListItem>
        </NaviLink>
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
          to="/reports"
          data-test="navigate-to-reports"
          onClick={() => toggleMenu()}
        >
          <ListItem button>
            <ListItemText primary="Reports" />
          </ListItem>
        </NaviLink>
        <AnchorLink
          href="/docs/"
          data-test="navigate-to-docs"
          onClick={() => toggleMenu()}
        >
          <ListItem button>
            <ListItemText primary="Documentation" />
          </ListItem>
        </AnchorLink>
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

const Content = withTheme()(styled.div`
  width: 240px;
  padding: ${props => props.theme.spacing.unit * 3}px 0;
`);

const NaviLink = styled(Link)`
  display: block;
  text-decoration: none;
`;

const AnchorLink = styled.a`
  text-decoration: none;
`;

export default connect(
  (state: any) => ({
    // TODO: maybe use selector
    menuVisible: state.navigation.menuVisible,
  }),
  {
    toggleMenu: navigation.actions.toggleMenu,
  }
)(SideBar);
