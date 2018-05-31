import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import PrevPageIcon from '@material-ui/icons/NavigateBefore';
import NextPageIcon from '@material-ui/icons/NavigateNext';
import LastPageIcon from '@material-ui/icons/LastPage';

import PageSelect from './PageSelect';

const propTypes = {
  paging: PropTypes.shape({
    page: PropTypes.number.isRequired
  }).isRequired,
  numOfPages: PropTypes.number.isRequired,
  onSelectPage: PropTypes.func.isRequired,
  listenKeys: PropTypes.bool
};

const pagingControlKeyPressed = event => {
  return navigator.userAgent.indexOf(' Mac ') !== -1
    ? event.altKey
    : event.ctrlKey;
};

class Paging extends React.Component {
  componentDidMount() {
    if (this.props.listenKeys) {
      document.addEventListener('keydown', this.keydownListener, false);
    }
  }
  componentWillUnmount() {
    if (this.props.listenKeys) {
      document.removeEventListener('keydown', this.keydownListener, false);
    }
  }
  keydownListener = event => {
    /* eslint-disable */
    // TODO how to avoid ReactDOM.findDOMNode?
    if (
      pagingControlKeyPressed(event) &&
      event.keyCode === 37 /* ArrowLeft */
    ) {
      ReactDOM.findDOMNode(this.prevButton).click();
    }
    if (
      pagingControlKeyPressed(event) &&
      event.keyCode === 39 /* ArrowRight */
    ) {
      ReactDOM.findDOMNode(this.nextButton).click();
    }
    /* eslint-enable */
  };
  selectFirstPage = () => {
    this.props.onSelectPage(0);
  };
  selectPrevPage = () => {
    this.props.onSelectPage(this.props.paging.page - 1);
  };
  selectNextPage = () => {
    this.props.onSelectPage(this.props.paging.page + 1);
  };
  selectLastPage = () => {
    this.props.onSelectPage(this.props.numOfPages - 1);
  };
  render() {
    return (
      <PagerWrapper flex={10} bottom={this.props.bottom}>
        <IconButton
          color='primary'
          disabled={this.props.paging.page <= 0}
          onClick={this.selectFirstPage}
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          ref={prevButton => (this.prevButton = prevButton)}
          color='primary'
          disabled={this.props.paging.page <= 0}
          onClick={this.selectPrevPage}
        >
          <PrevPageIcon />
        </IconButton>
        <PageSelect
          paging={this.props.paging}
          onSelectPage={this.props.onSelectPage}
          numOfPages={this.props.numOfPages}
        />
        <IconButton
          ref={nextButton => (this.nextButton = nextButton)}
          color='primary'
          disabled={this.props.paging.page >= this.props.numOfPages - 1}
          onClick={this.selectNextPage}
        >
          <NextPageIcon />
        </IconButton>
        <IconButton
          color='primary'
          disabled={this.props.paging.page >= this.props.numOfPages - 1}
          onClick={this.selectLastPage}
        >
          <LastPageIcon />
        </IconButton>
      </PagerWrapper>
    );
  }
}

const PagerWrapper = styled.div`
  display: block;
  text-align: left !important;
  flex: none !important;

  /* Pager buttons */
  > * {
    margin-right: 8px;
    display: inline-block;
  }
`;

Paging.propTypes = propTypes;

export default Paging;
