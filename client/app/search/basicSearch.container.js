import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TextField, Button } from 'react-components-kit';

import { search } from './search.ducks.js';

const BasicSearchWrapper = styled.div`
  margin: 0 16px;
`;

const inputStyles = {
  maxWidth: '500px',
  fontSize: '14px',
  padding: '8px'
};

const BasicSearchContainer = ({ onUpdateCriteria, onSearch }) => (
  <BasicSearchWrapper>
    <TextField
      placeholder='Search'
      inputStyles={inputStyles}
      onChange={e => onUpdateCriteria('query', e.target.value)}
    />
    <Button onClick={() => onSearch()}>Hae</Button>
  </BasicSearchWrapper>
);

function mapStateToProps(state) {
  return {
    query: state.search.query,
    results: state.search.results
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onUpdateCriteria: search.updateCriteria,
      onSearch: search.search
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  BasicSearchContainer
);
