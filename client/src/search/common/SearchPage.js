import React from 'react';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

import { common } from '~common/ducks';
import KeyListener from '~controls/paging/KeyListener';
import Results from '~controls/paging/Results';
import PopoverButton from '~controls/PopoverButton';

import { search, withSection } from './ducks';
import SearchBar from './SearchBar';

import SearchDrawer from './SearchDrawer';
import SearchPagingBar from './SearchPagingBar';

// TODO move to post
const onShowText = (index, onShowItem, history) => {
  history.push('/search/posts/browse');
  onShowItem(index);
};

const getMessage = results => {
  if (results.status === 'error') {
    return <Message>Error</Message>;
  }
  return null;
};

/* eslint-disable */
// TODO enable

const SearchPage = ({
  history,
  section,
  sectionTitle,
  searchFieldsComponent,
  itemComponent,
  openedItemComponent,
  inputValues,
  criteria,
  filters,
  paging,
  results,
  onUpdateCriteria,
  onUpdateFilter,
  onUpdateInputValue,
  onUpdatePaging,
  onSelectItem,
  onShowItem,
  onClear,
  onToggleDrawer
}) => {
  return (
    <div>
      <KeyListener
        results={results}
        paging={paging}
        onUpdatePaging={onUpdatePaging}
        onSelectItem={onSelectItem}
      />
      <SearchDrawer
        key="drawer"
        sectionTitle={sectionTitle}
        searchFieldsComponent={searchFieldsComponent}
        inputValues={inputValues}
        onUpdateInputValue={onUpdateInputValue}
        criteria={criteria}
        onUpdateCriteria={onUpdateCriteria}
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        onClear={onClear}
      />
      <StyledMain key="main">
        <FixedWrapper>
          <SearchBarWrapper>
            <SearchBar
              inputValues={inputValues}
              onUpdateInputValue={onUpdateInputValue}
              onUpdateCriteria={onUpdateCriteria}
              onToggleDrawer={onToggleDrawer}
            />
            <Actions>
              <PopoverButton icon={HelpIcon}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </PopoverButton>
            </Actions>
          </SearchBarWrapper>
          {results.totalCount === -1 &&
            results.status === 'fetching' && <LinearProgress />}
          {results.totalCount !== -1 && (
            <SearchPagingBar
              section={section}
              criteria={criteria}
              onUpdateCriteria={onUpdateCriteria}
              paging={paging}
              onUpdatePaging={onUpdatePaging}
              results={results}
            />
          )}
        </FixedWrapper>
        <Content>
          {getMessage(results)}
          {results.totalCount !== -1 &&
            results.status !== 'error' && (
              <ResultsWrapper>
                <div style={{ minHeight: '480px' }}>
                  {results.status === 'fetching' && <LinearProgress />}
                  {results.status !== 'fetching' && (
                    <Results
                      criteria={criteria}
                      results={results}
                      paging={paging}
                      filters={filters}
                      onUpdatePaging={onUpdatePaging}
                      onSelectItem={onSelectItem}
                      onShowItem={index =>
                        onShowText(index, onShowItem, history)
                      }
                      itemComponent={itemComponent}
                      openedItemComponent={openedItemComponent}
                    />
                  )}
                </div>
              </ResultsWrapper>
            )}
        </Content>
      </StyledMain>
    </div>
  );
};

const Actions = styled.div`
  display: flex;
  flex: 0.1;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
`;

const StyledMain = withTheme()(styled.main`
  width: calc(100% - 240px);
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition-property: margin;

  /* TODO make search drawer openable instead */
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }

  @media print {
    margin: 0;
    width: 100%;
  }
`);

const Content = styled.div`
  position: relative;
  overflow-y: auto;
  height: 100%;

  @media print {
    margin-top: 0;
  }
`;

const FixedWrapper = styled.div`
  z-index: 2;
  border-bottom: 1px solid #eee;

  @media print {
    display: none;
  }
`;

const ResultsWrapper = styled.div``;

const Message = styled.div`
  padding: 32px;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  flex: none;
  background-color: #fafafa;
  padding: 0px 32px;
`;

export const withMapStateToProps = (
  section,
  sectionTitle,
  searchFieldsComponent,
  itemComponent,
  openedItemComponent
) => {
  return state => {
    return {
      section,
      sectionTitle,
      searchFieldsComponent,
      itemComponent,
      openedItemComponent,
      inputValues: state.search[section].inputValues,
      criteria: state.search[section].criteria,
      filters: state.search[section].filters,
      paging: state.search[section].paging,
      results: state.search[section].results
    };
  };
};

export const withMapDispatchToProps = section => {
  return dispatch => {
    const actionCreators = bindActionCreators(
      {
        onUpdateInputValue: search.updateInputValue,
        onUpdateCriteria: search.updateCriteria,
        onUpdateFilter: search.updateFilter,
        onUpdatePaging: search.updatePaging,
        onSelectItem: search.selectItem,
        onShowItem: search.showItem,
        onClear: search.clear,
        onToggleDrawer: common.toggleDrawer
      },
      dispatch
    );

    return {
      // Add section parameter for all search actions
      onUpdateInputValue: withSection(
        section,
        actionCreators.onUpdateInputValue
      ),
      onUpdateCriteria: withSection(section, actionCreators.onUpdateCriteria),
      onUpdateFilter: withSection(section, actionCreators.onUpdateFilter),
      onUpdatePaging: withSection(section, actionCreators.onUpdatePaging),
      onSelectItem: withSection(section, actionCreators.onSelectItem),
      onShowItem: withSection(section, actionCreators.onShowItem),
      onClear: withSection(section, actionCreators.onClear),
      onToggleDrawer: actionCreators.onToggleDrawer
    };
  };
};

export default withRouter(SearchPage);
