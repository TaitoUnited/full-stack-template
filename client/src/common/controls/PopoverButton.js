import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton, Popover } from '@material-ui/core';

const propTypes = {
  icon: PropTypes.any.isRequired, // TODO use node or element instead?
  children: PropTypes.node.isRequired
};

class PopoverButton extends React.Component {
  state = {
    open: false,
    anchorEl: null,
    anchorOriginVertical: 'bottom',
    anchorOriginHorizontal: 'center',
    transformOriginVertical: 'top',
    transformOriginHorizontal: 'center'
  };

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value
    });
  };

  handleClickButton = () => {
    this.setState({
      open: true,
      anchorEl: findDOMNode(this.buttonWrapper) // eslint-disable-line
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  buttonWrapper = null;

  render() {
    const {
      open,
      anchorEl,
      anchorOriginVertical,
      anchorOriginHorizontal,
      transformOriginVertical,
      transformOriginHorizontal
    } = this.state;

    return (
      <div>
        <IconButton
          ref={node => {
            this.buttonWrapper = node;
          }}
          onClick={this.handleClickButton}
        >
          {React.createElement(this.props.icon, {})}
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleRequestClose}
          anchorOrigin={{
            vertical: anchorOriginVertical,
            horizontal: anchorOriginHorizontal
          }}
          transformOrigin={{
            vertical: transformOriginVertical,
            horizontal: transformOriginHorizontal
          }}
        >
          <PopoverContent>{this.props.children}</PopoverContent>
        </Popover>
      </div>
    );
  }
}

const PopoverContent = styled.div`
  max-width: 400px;
  padding: 16px !important;
`;

PopoverButton.propTypes = propTypes;

export default PopoverButton;
