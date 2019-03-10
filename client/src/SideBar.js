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
        <NaviLink
          to='/search/images'
          data-test='navigate-to-search-images'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Search images' />
          </ListItem>
        </NaviLink>
        <NaviLink
          to='/search/posts'
          data-test='navigate-to-search-posts'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Search posts' />
          </ListItem>
        </NaviLink>
        <NaviLink
          to='/images'
          data-test='navigate-to-images'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Images' />
          </ListItem>
        </NaviLink>
        <NaviLink
          to='/posts'
          data-test='navigate-to-posts'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Posts' />
          </ListItem>
        </NaviLink>
        <NaviLink
          to='/reports'
          data-test='navigate-to-reports'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Reports' />
          </ListItem>
        </NaviLink>
        <NaviLink
          to='/layouts'
          data-test='navigate-to-layouts'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Layouts and animations' />
          </ListItem>
        </NaviLink>
        <AnchorLink
          href='/docs/'
          data-test='navigate-to-docs'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Documentation' />
          </ListItem>
        </AnchorLink>
        <AnchorLink
          href='/admin/'
          data-test='navigate-to-admin'
          onClick={() => onToggleMenu()}
        >
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
  display: block;
  text-decoration: none;
`;

const AnchorLink = styled.a`
  text-decoration: none;
`;

export default SideBar;
