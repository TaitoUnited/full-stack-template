import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { Button, Snackbar, IconButton } from '@material-ui/core';
import { Close, Link as LinkIcon } from '@material-ui/icons';

let uniqueId = 0;

const propTypes = {
  buttonText: PropTypes.string.isRequired,
  infoMessage: PropTypes.string.isRequired,
  copyContent: PropTypes.string.isRequired,
  buttonClass: PropTypes.any
};

class CopyToClipboardButton extends React.Component {
  state = {
    open: false,
    uniqueId: ++uniqueId // eslint-disable-line
  };

  openSnackbar = () => {
    this.setState({ open: true });
  };

  closeSnackbar = () => {
    this.setState({ open: false });
  };

  render() {
    const { buttonClass } = this.props;
    return (
      <span>
        {/* invisible input that contains to content to be copied */}
        <HiddenTextArea
          id={`copyContent${this.state.uniqueId}`}
          value={this.props.copyContent}
          readOnly
        />

        {/* the button */}
        <Button
          variant='raised'
          color='primary'
          className={buttonClass}
          onClick={() => {
            // prettier conflict?
            // eslint-disable-next-line
            const linkElement = document.getElementById(
              `copyContent${this.state.uniqueId}`);
            linkElement.select();
            document.execCommand('Copy');
            linkElement.blur();
            this.openSnackbar();
          }}
        >
          {this.props.buttonText}
          <RightIcon />
        </Button>

        {/* info message snackbar */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.closeSnackbar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id='message-id'>{this.props.infoMessage}</span>}
          action={[
            <CloseButton
              key='close'
              aria-label='Close'
              color='inherit'
              onClick={this.closeSnackbar}
            >
              <Close />
            </CloseButton>
          ]}
        />
      </span>
    );
  }
}

const CloseButton = withTheme()(styled(IconButton)`
  && {
    width: ${props => props.theme.spacing.unit * 4}px;
    height: ${props => props.theme.spacing.unit * 4}px;
  }
`);

const RightIcon = withTheme()(styled(LinkIcon)`
  && {
    margin-left: ${props => props.theme.spacing.unit}px;
    height: ${props => props.theme.spacing.unit * 2}px;
    width: ${props => props.theme.spacing.unit * 2}px;
  }
`);

const HiddenTextArea = withTheme()(styled.textarea`
  && {
    color: transparent;
    background-color: transparent;
    border: none;
    font-size: 1px;
    width: 1px;
    margin: -1px 0 0 0;
    padding: 0;
    overflow: hidden;

    ::selection: {
      background-color: transparent;
    }
  }
`);

CopyToClipboardButton.propTypes = propTypes;

export default CopyToClipboardButton;
