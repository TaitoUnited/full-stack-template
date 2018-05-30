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
  withStyles
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

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
  magazineSection: {
    fontWeight: 'bold'
  },
  magazineItem: {
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
        {section === 'images' && (
          <FormGroup className={classes.gutter}>
            <FormLabel
              component='legend'
              htmlFor='photographers'
              className={classes.formLabel}
            >
              Photographer
            </FormLabel>
            <StyledFormControl className={classes.formControl}>
              <Select
                value=''
                onChange={e =>
                  onUpdateInputValue(
                    'photographers',
                    add(inputValues.photographers, e.target.value)
                  )
                }
                className={classes.input}
              >
                <MenuItem key='1' value='1'>
                  Matti Meikäläinen
                </MenuItem>
                <MenuItem key='2' value='2'>
                  Ville Voutilainen
                </MenuItem>
              </Select>
              {/* Photographer chips */}
              {inputValues.photographers &&
                !!inputValues.photographers.length &&
                inputValues.photographers.map(value => (
                  <StyledChip
                    key={value}
                    label={`${label(criteriaOptions.photographers, value)}`}
                    onDelete={() =>
                      onUpdateInputValue(
                        'photographers',
                        remove(inputValues.photographers, value)
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
            Tee haku
            <SearchIcon className={classes.rightIcon} />
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
            Tyhjennä ehdot
          </Button>
        </StyledFormControl>
      </Footer>
    </Content>
  </StyledDrawer>
);

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
  padding-top: 24px;
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
