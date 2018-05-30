import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Chip,
  Drawer,
  FormControl,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  Typography,
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

const styles = theme => ({
  database_0: {
    fontWeight: 'bold'
  },
  database_1: {
    paddingLeft: '30px'
  },
  sourceSection: {
    fontWeight: 'bold'
  },
  sourceItem: {
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

const SearchDrawer = ({
  drawerVisible,
  section,
  inputValues,
  onUpdateInputValue,
  criteria,
  criteriaOptions,
  onUpdateCriteria,
  onClear,
  classes
}) => (
  <StyledDrawer variant='persistent' open={drawerVisible}>
    <Content>
      <Forms>
        <Header>
          <Typography variant='title'>Search</Typography>
          <Typography>
            Demonstrates redux, redux-saga, paging and pushing state to browser
            history
          </Typography>
        </Header>
        {section === 'images' && (
          <FormGroup className={classes.gutter}>
            <FormLabel
              component='legend'
              htmlFor='sources'
              className={classes.formLabel}
            >
              Source
            </FormLabel>
            <StyledFormControl className={classes.formControl}>
              <Select
                value=''
                onChange={e =>
                  onUpdateInputValue(
                    'sources',
                    add(inputValues.sources, e.target.value)
                  )
                }
                className={classes.input}
              >
                <MenuItem key='1' value='1'>
                  Imagebank
                </MenuItem>
                <MenuItem key='2' value='2'>
                  Google
                </MenuItem>
              </Select>
              {/* source chips */}
              {inputValues.sources &&
                !!inputValues.sources.length &&
                inputValues.sources.map(value => (
                  <StyledChip
                    key={value}
                    label={`${label(criteriaOptions.sources, value)}`}
                    onDelete={() =>
                      onUpdateInputValue(
                        'sources',
                        remove(inputValues.sources, value)
                      )
                    }
                  />
                ))}
            </StyledFormControl>
          </FormGroup>
        )}
        {section === 'images' && (
          <FormGroup className={classes.gutter}>
            <FormLabel
              component='legend'
              htmlFor='authors'
              className={classes.formLabel}
            >
              Author
            </FormLabel>
            <StyledFormControl className={classes.formControl}>
              <Select
                value=''
                onChange={e =>
                  onUpdateInputValue(
                    'authors',
                    add(inputValues.authors, e.target.value)
                  )
                }
                className={classes.input}
              >
                <MenuItem key='1' value='1'>
                  John Doe
                </MenuItem>
                <MenuItem key='2' value='2'>
                  Jane Doe
                </MenuItem>
              </Select>
              {/* author chips */}
              {inputValues.authors &&
                !!inputValues.authors.length &&
                inputValues.authors.map(value => (
                  <StyledChip
                    key={value}
                    label={`${label(criteriaOptions.authors, value)}`}
                    onDelete={() =>
                      onUpdateInputValue(
                        'authors',
                        remove(inputValues.authors, value)
                      )
                    }
                  />
                ))}
            </StyledFormControl>
          </FormGroup>
        )}
      </Forms>
      <Footer>
        <StyledFormControl>
          <Button
            variant='raised'
            color='primary'
            onClick={() =>
              onUpdateCriteria('simpleText', inputValues.simpleText, true)
            }
          >
            Search
          </Button>
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
  margin-bottom: 32px;
`;

const StyledDrawer = styled(Drawer)`
  z-index: 1000 !important;
  visibility: ${props => (props.open ? 'visible' : 'hidden')};

  > div {
    margin-top: 64px !important;
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

const StyledChip = styled(Chip)`
  margin: 0px 4px 8px !important;
  font-size: 12px !important;
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
  height: -webkit-calc(100% - 176px);
  height: -moz-calc(100% - 176px);
  height: calc(100% - 176px);
  overflow-y: auto;
  overflow-x: hidden;

  .error-message {
    color: #fd6b6d !important;
    font-size: 0.875rem;
  }
`;

const Footer = styled.div`
  background-color: #fafafa;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 5px 32px 0px;
  height: 176px;
  z-index: 1;
  border-top: 1px solid #eee;
  > div > button {
    margin-bottom: 8px;
  }
`;

export default withStyles(styles)(SearchDrawer);
