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
    <Typography>Search implemented with Redux and redux-saga.</Typography>
    <Typography>
      TODO copy up-to-date search example from the other project back to this
      one.
    </Typography>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchResults)
);
