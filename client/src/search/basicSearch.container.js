import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import { search } from './search.ducks.js';

const StyledWrapper = styled.div`
  margin: 0 16px;
  flex: 1;
  display: flex;
`;

const StyledInput = styled.input`
  flex: 1;
  max-width: 512px;
  margin: 4px 0;
  padding: 0 8px;
`;

const BasicSearchContainer = ({
  inputValues,
  onUpdateCriteria,
  onUpdateInputValue
}) => (
  <StyledWrapper>
    <StyledInput
      type='text'
      placeholder='Search'
      onChange={e => onUpdateInputValue('query', e.target.value)}
    />
    <Button onClick={() => onUpdateCriteria('query', inputValues.query)}>
      Hae
    </Button>
  </StyledWrapper>
);

function mapStateToProps(state) {
  return {
    inputValues: state.search.inputValues
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      onUpdateInputValue: search.updateInputValue,
      onUpdateCriteria: search.updateCriteria
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(
  BasicSearchContainer
);
