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

import { search, withSection } from './ducks';
import SearchBar from './SearchBar';

import SearchDrawer from './SearchDrawer';
import SearchPagingBar from './SearchPagingBar';

const onShowText = (index, onShowItem, history) => {
  history.push('/posts/browse');
  onShowItem(index);
};

// TODO remove
const helpContentBySection = {
  images: 'https://www.google.fi',
  posts: 'https://www.google.fi'
};

const getMessage = (databasesInitialized, databases, results) => {
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
  itemComponent,
  openedItemComponent,
  databasesInitialized,
  databases,
  inputValues,
  criteria,
  criteriaOptions,
  filters,
  paging,
  results,
  drawerVisible,
  onUpdateCriteria,
  onUpdateFilter,
  onUpdateInputValue,
  onUpdatePaging,
  onSelectItem,
  onShowItem,
  onClear,
  onToggleDrawer
}) => {
  const brokenResults = results.totalCount > 0 && !results.items.length;
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
        section={section}
        drawerVisible={drawerVisible}
        databases={databases}
        inputValues={inputValues}
        onUpdateInputValue={onUpdateInputValue}
        criteria={criteria}
        criteriaOptions={criteriaOptions}
        onUpdateCriteria={onUpdateCriteria}
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        onClear={onClear}
      />
      <StyledMain key="main" drawerVisible={drawerVisible}>
        <FixedWrapper drawerVisible={drawerVisible}>
          <SearchBarWrapper>
            <SearchBar
              inputValues={inputValues}
              onUpdateInputValue={onUpdateInputValue}
              onUpdateCriteria={onUpdateCriteria}
              onToggleDrawer={onToggleDrawer}
              drawerVisible={drawerVisible}
              color={
                /* Criteria could be checked in a prettier way, but requires
                   quite specific filtering */
                !databases.length ||
                criteria.database !== databases[0].id ||
                (!!criteria.sources && criteria.sources.length !== 0) ||
                (!!criteria.authors &&
                  criteria.authors.length !== 0) ||
                (!!criteria.startDate && criteria.startDate.length !== 0) ||
                (!!criteria.endDate && criteria.endDate.length !== 0) ||
                (!!filters.shape && filters.shape !== '-')
                  ? 'primary'
                  : 'default'
              }
            />
            <Actions>
              <HelpButton>
                <a
                  href={helpContentBySection[section]}
                  target="_blank"
                  title="Käyttöohjeet"
                >
                  <HelpIcon />
                </a>
              </HelpButton>
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
              drawerVisible={drawerVisible}
            />
          )}
        </FixedWrapper>
        <Content>
          {getMessage(databasesInitialized, databases, results)}
          {results.totalCount !== -1 &&
            results.status !== 'error' && (
              <ResultsWrapper>
                <div style={{ minHeight: '480px' }}>
                  {results.status === 'fetching' && <LinearProgress />}
                  {results.status !== 'fetching' &&
                    !brokenResults && (
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
                  {results.status !== 'fetching' &&
                    brokenResults && (
                      <Message>
                        Tämä hakutuloksen sivu sisältää rikkinäistä tietoa, jota
                        ei näytetä. Vaihda sivua, kiitos.
                      </Message>
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
  width: ${props => (props.drawerVisible ? 'calc(100% - 240px)' : '100%')};
  margin-left: ${props => (props.drawerVisible ? '240px' : '0')};
  display: flex;
  flex-direction: column;
  position: relative;
  transition-property: margin;
  transition-duration: ${props =>
    props.drawerVisible
      ? props.theme.transitions.duration.enteringScreen
      : props.theme.transitions.duration.leavingScreen};
  transition-timing-function: ${props =>
    props.drawerVisible
      ? props.theme.transitions.easing.easeOut
      : props.theme.transitions.easing.sharp};

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

const HelpButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 100%;
  a {
    color: #0000008a;
  }
`;

export const withMapStateToProps = (
  section,
  itemComponent,
  openedItemComponent
) => {
  return state => {
    return {
      section,
      itemComponent,
      openedItemComponent,
      inputValues: state.search[section].inputValues,
      criteria: state.search[section].criteria,
      criteriaOptions: state.search[section].criteriaOptions,
      filters: state.search[section].filters,
      paging: state.search[section].paging,
      results: state.search[section].results,
      databasesInitialized: state.common.databasesBySection.initialized,
      databases: state.common.databasesBySection[section],
      drawerVisible: state.common.drawerVisible
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
