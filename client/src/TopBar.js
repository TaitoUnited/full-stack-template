import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const TopBar = ({ onToggleMenu, classes }) => (
  <AppBar position='static'>
    <Toolbar>
      <IconButton
        aria-label='open drawer'
        color='inherit'
        className={classes.menuButton}
        onClick={() => onToggleMenu()}
      >
        <MenuIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

export default withStyles(styles)(TopBar);
