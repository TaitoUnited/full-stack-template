import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Divider } from 'material-ui';
import View from '~layout/view.component';
import Paging from '~layout/paging.component';

import { search } from './search.ducks.js';
import ResultList from './resultList.component';

const StyledView = styled(View)``;

const StyledDivider = styled(Divider).attrs({
  light: true
})`
  margin: 8px 0 !important;
`;

const ResultViewContainer = ({
  paging,
  results,
  onUpdatePaging,
  onSelectItem,
  menuVisible
}) => (
  <StyledView className='SearchView' title='Search' type='fullPage'>
    <Paging
      paging={paging}
      onUpdatePaging={onUpdatePaging}
      results={results}
      menuVisible={menuVisible}
    />
    <StyledDivider />
    {results.status === 'fetching' ? (
      <div>Loading...</div>
    ) : (
      <div style={{ width: '100%' }}>
        <ResultList results={results} onSelectItem={onSelectItem} />
        <StyledDivider />
        <Paging
          paging={paging}
          onUpdatePaging={onUpdatePaging}
          results={results}
          bottom
          menuVisible={menuVisible}
        />
      </div>
    )}
  </StyledView>
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
