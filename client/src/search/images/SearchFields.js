import React from 'react';
import styled from 'styled-components';
import {
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';

const FormFields = ({
  inputValues,
  // onUpdateInputValue
  // criteria,
  onUpdateCriteria
}) => [
  <StyledFormGroup key='type'>
    <StyledFormControl>
      <InputLabel htmlFor='type'>Type</InputLabel>
      <Select
        inputProps={{ id: 'type', name: 'type' }}
        value={inputValues.type || ''}
        onChange={e => onUpdateCriteria('type', e.target.value, true)}
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        <MenuItem key='jpg' value='jpg'>
          jpg
        </MenuItem>
        <MenuItem key='png' value='png'>
          png
        </MenuItem>
      </Select>
    </StyledFormControl>
  </StyledFormGroup>
];

// TODO duplicate with SearchDrawer.js
const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 16px;
`;

const StyledFormControl = styled(FormControl)`
  margin: 8px 0 !important;
  width: 100%;
  max-width: 176px; /* firefox fix */
`;

export default FormFields;
