import React from 'react';
import styled from 'styled-components';
import {
  Chip,
  FormControl,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  withStyles
} from '@material-ui/core';

const add = (array, value) => {
  return (array || []).concat(value);
};

const remove = (array, value) => {
  return (array || []).filter(itemValue => itemValue !== value);
};

const label = (array, value) => {
  const option = array && array.find(item => item.value === value);
  return option ? option.title : value;
};

const FormFields = ({
  inputValues,
  onUpdateInputValue,
  // criteria,
  criteriaOptions,
  // onUpdateCriteria,
  classes
}) => [
  <FormGroup className={classes.gutter}>
    <FormLabel component='legend' htmlFor='types' className={classes.formLabel}>
      Type
    </FormLabel>
    <StyledFormControl className={classes.formControl}>
      <Select
        value=''
        onChange={e =>
          onUpdateInputValue('types', add(inputValues.types, e.target.value))
        }
        className={classes.input}
      >
        <MenuItem key='jpeg' value='jpeg'>
          jpeg
        </MenuItem>
        <MenuItem key='png' value='png'>
          png
        </MenuItem>
      </Select>
      {/* type chips */}
      {inputValues.types &&
        !!inputValues.types.length &&
        inputValues.types.map(value => (
          <StyledChip
            key={value}
            label={`${label(criteriaOptions.types, value)}`}
            onDelete={() =>
              onUpdateInputValue('types', remove(inputValues.types, value))
            }
          />
        ))}
    </StyledFormControl>
  </FormGroup>
];

const styles = theme => ({
  database_0: {
    fontWeight: 'bold'
  },
  database_1: {
    paddingLeft: '30px'
  },
  typeSection: {
    fontWeight: 'bold'
  },
  typeItem: {
    paddingLeft: '40px'
  },
  input: {
    border: '0',
    borderRadius: '2px 2px 0px 0px',
    paddingTop: '4px',
    paddingLeft: '8px',
    marginTop: '2px',
    marginBottom: '10px',
    fontSize: '13px !important',
    width: '100%'
  },
  formLabel: {
    fontSize: '14px !important'
  },
  gutter: {
    marginBottom: '8px'
  },
  formControl: {
    display: 'inline'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    height: 20,
    width: 20
  }
});

const StyledFormControl = styled(FormControl)`
  margin: 8px 0 !important;
  width: 100%;
  max-width: 176px; /* firefox fix */
`;

const StyledChip = styled(Chip)`
  margin: 0px 4px 8px !important;
  font-size: 12px !important;
`;

export default withStyles(styles)(FormFields);
