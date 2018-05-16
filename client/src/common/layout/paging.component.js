import React from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import SortMenu from './sortMenu.component.js';
import PageMenu from './pageMenu.component.js';

const PagingWrapper = styled.div`
  display: flex;
`;

const Info = styled.div`
  display: ${props => (props.bottom ? 'none' : 'flex')};
  flex: 5;
  text-align: left;
  flex-direction: column;
  justify-content: center;
`;

const Actions = styled.div`
  display: ${props => (props.bottom ? 'none' : 'block')};
  flex: 5;
  text-align: right;
  button {
    padding-left: 0;
    padding-right: 0;
  }
`;

const PagerWrapper = styled.div`
  display: ${props => (props.bottom ? 'inline-block' : 'block')};
  flex: 5;
  text-align: center;

  /* Hide paging from top on a narrow screen */
  @media (max-width: 800px) {
    display: ${props =>
      !props.bottom && props.menuVisible ? 'none' : 'inline-block'};
  }
  @media (max-width: 560px) {
    display: ${props => (!props.bottom ? 'none' : 'inline-block')};
  }

  /* Pager buttons */
  > * {
    margin-right: 8px;
    display: inline-block;
    /* Show buttons one below another on a narrow screen */
    @media (max-width: 600px) {
      display: ${props => (props.menuVisible ? 'block' : 'inline-block')};
    }
    @media (max-width: 380px) {
      display: block;
    }
  }
`;

const Pager = ({
  results,
  paging,
  numOfPages,
  onSelectPage,
  bottom,
  menuVisible
}) => (
  <PagerWrapper flex={5} bottom={bottom} menuVisible={menuVisible}>
    <Button
      color='primary'
      disabled={paging.page <= 0}
      onClick={() => {
        onSelectPage(paging.page - 1);
      }}
    >
      &laquo; Previous
    </Button>
    <PageMenu
      paging={paging}
      onSelectPage={onSelectPage}
      results={results}
      numOfPages={numOfPages}
    />
    <Button
      color='primary'
      disabled={paging.page >= numOfPages - 1}
      onClick={() => {
        onSelectPage(paging.page + 1);
      }}
    >
      Next &raquo;
    </Button>
  </PagerWrapper>
);

const getNumOfPages = (paging, results) => {
  return results
    ? Math.max(1, Math.floor(results.totalCount / paging.pageSize))
    : 1;
};

const onSelectPage = (page, numOfPages, onUpdatePaging) => {
  if (page >= 0 && page < numOfPages) {
    onUpdatePaging('page', page);
  }
};

const Paging = ({ paging, results, onUpdatePaging, bottom, menuVisible }) => {
  const numOfPages = getNumOfPages(paging, results);
  return (
    <PagingWrapper centerSelf>
      <Info flex={1} bottom={bottom} menuVisible={menuVisible}>
        {results.totalCount} results
      </Info>
      <Pager
        flex={5}
        bottom={bottom}
        menuVisible={menuVisible}
        paging={paging}
        results={results}
        numOfPages={numOfPages}
        onSelectPage={page => onSelectPage(page, numOfPages, onUpdatePaging)}
      />
      <Actions flex={1} bottom={bottom} menuVisible>
        <SortMenu paging={paging} onUpdatePaging={onUpdatePaging} />
      </Actions>
    </PagingWrapper>
  );
};

// TODO propTypes for paging

export default Paging;
