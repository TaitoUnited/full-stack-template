import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
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
      <Typography className={classes.logo} color='inherit'>
        Taito United
      </Typography>
    </Toolbar>
  </AppBar>
);

const styles = {
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  logo: {
    marginTop: 2,
    marginLeft: -4,
    fontSize: 16,
    textTransform: 'uppercase'
  }
};

export default withStyles(styles)(TopBar);
