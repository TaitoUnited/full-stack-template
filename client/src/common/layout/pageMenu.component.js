import React from 'react';
import { Menu, MenuItem, Button } from 'material-ui';

import * as fn from '~utils/fn.util';

class PageMenu extends React.Component {
  state = {
    anchorEl: null,
    open: false
  };

  onOpen = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  onSelect = page => {
    this.onClose();
    this.props.onSelectPage(page);
  };

  render() {
    return (
      <div>
        <Button
          aria-owns={this.state.open ? 'simple-menu' : null}
          aria-haspopup='true'
          onClick={this.onOpen}
        >
          {this.props.paging.page + 1}
          /
          {this.props.numOfPages}
        </Button>
        <Menu
          id='simple-menu'
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.onClose}
        >
          {fn.times(this.props.numOfPages)(index => (
            <MenuItem
              key={index}
              selected={this.props.paging.page === index}
              onClick={() => this.onSelect(index)}
            >
              {index + 1}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default PageMenu;
