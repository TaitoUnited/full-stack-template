import React from 'react';
import styled from 'styled-components';

import ResultItem from './resultItem.component';

const StyledWrapper = styled.div`
  padding: 8px 0;
`;

const ResultList = ({ results, onSelectItem }) => (
  <StyledWrapper>
    {results.items.map((item, index) => (
      <ResultItem
        key={item.id}
        item={item}
        selected={index === results.selectedIndex}
        onSelect={() => onSelectItem(index)}
        onSelectPrev={index > 0 ? () => onSelectItem(index - 1) : null}
        onSelectNext={
          index < results.items.length - 1
            ? () => onSelectItem(index + 1)
            : null
        }
      />
    ))}
  </StyledWrapper>
);

export default ResultList;
