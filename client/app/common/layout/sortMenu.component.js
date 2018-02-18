import React from 'react';
import { Menu, MenuItem, Button } from 'material-ui';

class SortMenu extends React.Component {
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

  onSelect = sortBy => {
    this.onClose();
    this.props.onUpdatePaging('sortBy', sortBy);
  };

  render() {
    return (
      <div>
        <Button
          aria-owns={this.state.open ? 'simple-menu' : null}
          aria-haspopup='true'
          onClick={this.onOpen}
        >
          Sort by
        </Button>
        <Menu
          id='simple-menu'
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.onClose}
        >
          <MenuItem
            selected={this.props.paging.sortBy === 'name'}
            onClick={() => this.onSelect('name')}
          >
            Name
          </MenuItem>
          <MenuItem
            selected={this.props.paging.sortBy === 'size'}
            onClick={() => this.onSelect('size')}
          >
            Size
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default SortMenu;
