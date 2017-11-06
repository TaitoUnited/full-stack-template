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
  paging,
  results,
  onUpdatePaging,
  onSelectItem,
  menuVisible
}) => (
  <ResultViewWrapper className='SearchView' title='Search' type='fullPage'>
    <Paging
      paging={paging}
      onUpdatePaging={onUpdatePaging}
      results={results}
      menuVisible={menuVisible}
    />
    <Divider />
    {results.status === 'fetching' ? (
      <div>Loading...</div>
    ) : (
      <div style={{ width: '100%' }}>
        <ResultList results={results} onSelectItem={onSelectItem} />
        <Divider />
        <Paging
          paging={paging}
          onUpdatePaging={onUpdatePaging}
          results={results}
          bottom
          menuVisible={menuVisible}
        />
      </div>
    )}
  </ResultViewWrapper>
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
  connect(mapStateToProps, mapDispatchToProps)(ResultViewContainer)
);
