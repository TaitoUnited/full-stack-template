import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Snackbar,
  IconButton,
  CloseIcon,
  LinkIcon
} from '@material-ui/core';

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
    const { classes, buttonClass } = this.props;
    return (
      <span>
        {/* invisible input that contains to content to be copied */}
        <textarea
          className={classes.hiddenTextArea}
          id={`copyContent${this.state.uniqueId}`}
          value={this.props.copyContent}
          readOnly
        />

        {/* the button */}
        <Button
          raised
          color='primary'
          className={buttonClass}
          onClick={() => {
            const linkElement = document.getElementById(
              `copyContent${this.state.uniqueId}`
            );
            linkElement.select();
            document.execCommand('Copy');
            linkElement.blur();
            this.openSnackbar();
          }}
        >
          {this.props.buttonText}
          <LinkIcon className={classes.rightIcon} />
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
            <IconButton
              key='close'
              aria-label='Close'
              color='inherit'
              className={classes.close}
              onClick={this.closeSnackbar}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </span>
    );
  }
}

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    height: 16,
    width: 16
  },
  HiddenTextArea: {
    color: 'transparent',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1px',
    width: '1px',
    margin: '-1px 0 0 0',
    padding: '0',
    overflow: 'hidden',

    '::selection': {
      backgroundColor: 'transparent'
    }
  }
});

CopyToClipboardButton.propTypes = propTypes;

export default withStyles(styles)(CopyToClipboardButton);
