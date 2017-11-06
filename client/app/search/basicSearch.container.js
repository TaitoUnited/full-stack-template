import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import { TextField, Button } from 'react-components-kit';

import { Button } from 'material-ui';

import { search } from './search.ducks.js';

const BasicSearchWrapper = styled.div`
  margin: 0 16px;
  flex: 1;
`;

// const inputStyles = {
//   maxWidth: '500px',
//   fontSize: '14px',
//   padding: '8px'
// };

const BasicSearchContainer = ({
  inputValues,
  onUpdateCriteria,
  onUpdateInputValue
}) => (
  <BasicSearchWrapper>
    <input
      type='text'
      placeholder='Search'
      onChange={e => onUpdateInputValue('query', e.target.value)}
    />
    <Button
      color='contrast'
      onClick={() => onUpdateCriteria('query', inputValues.query)}
    >
      Hae
    </Button>
  </BasicSearchWrapper>
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
