import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import ErrorBoundary from '~infra/ErrorBoundary';

import { search } from './ducks.js';

const SearchResults = () => (
  <ErrorBoundary>
    <Typography variant='title'>Search</Typography>
    <Typography>
      Demonstrates redux, redux-saga, styled components and pushing state to
      browser history
    </Typography>
    <br />
    <Typography>TODO move the existing search example here</Typography>
  </ErrorBoundary>
);

const mapStateToProps = state => {
  return {
    paging: state.search.paging,
    results: state.search.results,
    menuVisible: state.common.menuVisible
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      onUpdatePaging: search.updatePaging,
      onSelectItem: search.selectItem
    },
    dispatch
  );
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults));
