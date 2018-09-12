import React from 'react';
import styled from 'styled-components';
import Paging from '~controls/paging/Paging';
import { getNumOfPages } from '~controls/paging/utils';

const onSelectPage = (page, numOfPages, onUpdatePaging) => {
  if (page >= 0 && page < numOfPages) {
    onUpdatePaging('page', page);
  }
};

const SearchPagingBar = ({
  section, paging, onUpdatePaging, results
}) => {
  const numOfPages = getNumOfPages(paging, results);
  return (
    <PagingWrapper centerSelf>
      <Info flex={1}>
        {results.totalCount}
        &nbsp;
        {section === 'images' ? 'kuvaa' : 'tekstiä'}
      </Info>
      {results.totalCount > 0 && (
        <Paging
          flex={5}
          listenKeys
          paging={paging}
          numOfPages={numOfPages}
          onSelectPage={page => onSelectPage(page, numOfPages, onUpdatePaging)}
        />
      )}
      <Empty />
    </PagingWrapper>
  );
};

const PagingWrapper = styled.div`
  display: flex;
  background-color: #fff;
  padding: 0px 32px;
  flex-wrap: wrap;

  @media (max-width: 630px) {
    display: block !important;
  }
`;

const Info = styled.div`
  display: flex;
  flex: 1;
  text-align: left;
  flex-direction: column;
  justify-content: center;
  padding: 15px 0;
`;

const Empty = styled.div`
  flex: 1;
`;

export default SearchPagingBar;
