import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';

/* eslint-disable jsx-a11y/anchor-is-valid */
// TODO remove anchor-is-valid (was introduced in eslint upgrade)

const SideBar = ({ menuVisible, onToggleMenu, classes }) => (
  <SwipeableDrawer
    type='persistent'
    open={menuVisible}
    onOpen={() => onToggleMenu(true)}
    onClose={() => onToggleMenu(false)}
  >
    <div className={classes.content}>
      <List>
        <Link
          className={classes.link}
          to='/search'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Search' />
          </ListItem>
        </Link>
        <Link
          className={classes.link}
          to='/posts'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Posts' />
          </ListItem>
        </Link>
        <Link
          className={classes.link}
          to='/images'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Images' />
          </ListItem>
        </Link>
        <Link
          className={classes.link}
          to='/reports'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Reports' />
          </ListItem>
        </Link>
        <Link
          className={classes.link}
          to='/layouts'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Layouts and animations' />
          </ListItem>
        </Link>
        <a
          className={classes.link}
          href='/admin/'
          onClick={() => onToggleMenu()}
        >
          <ListItem button>
            <ListItemText primary='Admin GUI' />
          </ListItem>
        </a>
      </List>
    </div>
  </SwipeableDrawer>
);

const styles = {
  content: {
    width: '272px',
    padding: '24px 0'
  },
  link: {
    textDecoration: 'none'
  }
};

export default withStyles(styles)(SideBar);
