import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';

const SideBar = ({ menuVisible, onToggleMenu, classes }) => (
  <SwipeableDrawer
    type='persistent'
    open={menuVisible}
    onOpen={() => onToggleMenu(true)}
    onClose={() => onToggleMenu(false)}
  >
    <div className={classes.content}>
      <List>
        <Link to='/posts' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Posts (Vanilla)' />
          </ListItem>
        </Link>
        <Link to='/search' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Search (Redux + saga)' />
          </ListItem>
        </Link>
        <Link to='/todo' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Files' />
          </ListItem>
        </Link>
        <Link to='/todo' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Reports' />
          </ListItem>
        </Link>
        <Link to='/todo' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Animations' />
          </ListItem>
        </Link>
        <Link to='/todo' onClick={() => onToggleMenu()}>
          <ListItem button>
            <ListItemText primary='Layouts' />
          </ListItem>
        </Link>
      </List>
    </div>
  </SwipeableDrawer>
);

const styles = {
  content: {
    width: '250px',
    padding: '24px 0'
  }
};

export default withStyles(styles)(SideBar);
