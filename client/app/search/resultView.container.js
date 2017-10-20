import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Divider } from 'react-components-kit';
import View from '~layout/view.component';
import Paging from '~layout/paging.component';

import { search } from './search.ducks.js';
import ResultList from './resultList.component';

const ResultViewWrapper = styled(View)``;

const ResultViewContainer = ({
  criteria,
  results,
  onUpdateCriteria,
  onSelectPage,
  menuVisible
}) => (
  <ResultViewWrapper className='SearchView' title='Search' type='fullPage'>
    <Paging
      criteria={criteria}
      results={results}
      onUpdateCriteria={onUpdateCriteria}
      onSelectPage={onSelectPage}
      menuVisible={menuVisible}
    />
    <Divider />
    <ResultList />
    <Divider />
    <Paging
      bottom
      criteria={criteria}
      results={results}
      onUpdateCriteria={onUpdateCriteria}
      onSelectPage={onSelectPage}
      menuVisible={menuVisible}
    />
  </ResultViewWrapper>
);

function mapStateToProps(state) {
  return {
    criteria: state.search.criteria,
    results: state.search.results,
    menuVisible: state.common.menuVisible
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onUpdateCriteria: search.onUpdateCriteria,
      onSelectPage: search.selectPage
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResultViewContainer)
);
