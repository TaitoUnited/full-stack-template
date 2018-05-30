import React from 'react';
import styled from 'styled-components';
import { IconButton, withStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

// TODO simpleText only

const SearchBar = ({ inputValues, onUpdateInputValue, onUpdateCriteria }) => (
  <SearchBarWrapper>
    <SearchBarContent>
      <StyledInput
        type='text'
        placeholder='Search'
        value={inputValues.simpleText || ''}
        onChange={e => onUpdateInputValue('simpleText', e.target.value)}
        onKeyPress={e =>
          e.key === 'Enter' &&
          onUpdateCriteria('simpleText', e.target.value, true)
        }
      />
      <IconButton
        color='primary'
        onClick={() =>
          onUpdateCriteria('simpleText', inputValues.simpleText, true)
        }
      >
        <SearchIcon />
      </IconButton>
    </SearchBarContent>
  </SearchBarWrapper>
);

const SearchBarWrapper = styled.div`
  flex: 10;
`;

const SearchBarContent = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
`;

const StyledInput = styled.input`
  flex: 1;
  min-width: 80px;
  margin: 9px 0 8px 0;
  padding: 0 8px;
`;

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

export default withStyles(styles)(SearchBar);
