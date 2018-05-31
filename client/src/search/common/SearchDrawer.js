import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Drawer,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@material-ui/core';

const SearchDrawer = ({
  sectionTitle,
  searchFieldsComponent,
  inputValues,
  onUpdateInputValue,
  criteria,
  onUpdateCriteria,
  onClear
}) => (
  <StyledDrawer variant='persistent' open>
    <Content>
      <Forms>
        <Header>
          <Typography variant='title'>{sectionTitle}</Typography>
          <Typography>
            Demonstrates redux, redux-saga, paging and pushing state to browser
            history
          </Typography>
        </Header>
        <StyledFormGroup>
          <StyledFormControl>
            <InputLabel htmlFor='author'>Author</InputLabel>
            <Select
              inputProps={{ id: 'author' }}
              value={inputValues.author || ''}
              onChange={e => onUpdateCriteria('author', e.target.value, true)}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              <MenuItem value='John Doe'>John Doe</MenuItem>
              <MenuItem value='Jane Doe'>Jane Doe</MenuItem>
            </Select>
          </StyledFormControl>
        </StyledFormGroup>
        {React.createElement(searchFieldsComponent, {
          inputValues,
          onUpdateInputValue,
          criteria,
          onUpdateCriteria
        })}
      </Forms>
      <Footer>
        <StyledFormControl>
          {/*
          <Button
            variant='raised'
            color='primary'
            onClick={() =>
              onUpdateCriteria('simpleText', inputValues.simpleText, true)
            }
          >
            Search
          </Button>
          */}
          <Button
            variant='raised'
            onClick={() =>
              onClear({
                inputValues: { simpleText: inputValues.simpleText },
                criteria: { simpleText: criteria.simpleText }
              })
            }
          >
            Clear
          </Button>
        </StyledFormControl>
      </Footer>
    </Content>
  </StyledDrawer>
);

const Header = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const StyledDrawer = styled(Drawer)`
  z-index: 1000 !important;
  visibility: ${props => (props.open ? 'visible' : 'hidden')};

  > div {
    margin-top: 64px !important;
  }

  /* TODO make search drawer openable instead */
  @media (max-width: 768px) {
    display: none !important;
  }

  @media print {
    display: none;
  }
`;

const StyledFormControl = styled(FormControl)`
  margin: 8px 0 !important;
  width: 100%;
  max-width: 176px; /* firefox fix */
`;

const Content = styled.div`
  width: 240px;
  background-color: #fafafa;
  height: calc(100vh - 48px) !important;
  overflow: auto;
`;

const Forms = styled.div`
  position: relative;
  padding: 16px 32px 0px;
  height: -webkit-calc(100% - 128px);
  height: -moz-calc(100% - 128px);
  height: calc(100% - 128px);
  overflow-y: auto;
  overflow-x: hidden;

  .error-message {
    color: #fd6b6d !important;
    font-size: 0.875rem;
  }
`;

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 16px;
`;

const Footer = styled.div`
  background-color: #fafafa;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 5px 32px 0px;
  height: 128px;
  z-index: 1;
  border-top: 1px solid #eee;
  > div > button {
    margin-bottom: 8px;
  }
`;

export default SearchDrawer;
