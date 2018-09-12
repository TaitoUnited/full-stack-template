import React from 'react';
import PropTypes from 'prop-types';

import { prevFunc, nextFunc } from './utils';

const propTypes = {
  listenEsc: PropTypes.bool,
  results: PropTypes.shape({
    selectedIndex: PropTypes.number.isRequired,
    items: PropTypes.array
  }).isRequired,
  paging: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
  }).isRequired,
  onUpdatePaging: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired
};

const defaultProps = {
  listenEsc: true
};

class KeyListener extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.keydownListener, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownListener, false);
  }

  keydownListener = event => {
    const {
      listenEsc,
      results,
      paging,
      onSelectItem,
      onUpdatePaging
    } = this.props;
    if (
      !event.altKey
      && !event.shiftKey
      && !event.ctrlKey
      && !event.metaKey
      && event.target.nodeName !== 'INPUT'
    ) {
      if (event.keyCode === 27 && listenEsc) {
        // ESC
        onSelectItem(-1);
      }
      if (event.keyCode === 37) {
        // ArrowLeft
        const prev = prevFunc(
          results.selectedIndex,
          paging,
          onUpdatePaging,
          onSelectItem
        );
        if (prev) prev('key');
      }
      if (event.keyCode === 39) {
        // ArrowRight
        const next = nextFunc(
          results.selectedIndex,
          results,
          paging,
          onUpdatePaging,
          onSelectItem
        );
        if (next) next('key');
      }
    }
  };

  render() {
    return null;
  }
}

KeyListener.propTypes = propTypes;
KeyListener.defaultProps = defaultProps;

export default KeyListener;
