import React from 'react';
import styled from 'styled-components';
import { Card } from 'react-components-kit';
import { Button } from 'material-ui';

const contentByType = {
  picture: ({ name, description }) => `${name} ${description}`,
  document: () => 'Document',
  sheet: () => 'Sheet'
};

const expandedContentByType = {
  picture: ({ name, description }) => `${name} ${description}`,
  document: () => 'Document',
  sheet: () => 'Sheet'
};

const ResultItemWrapper = styled(Card.Animated).attrs({
  depth: 1
})`
  display: inline-block;
  margin: 0 8px 8px 0;
  width: 200px;
  height: 128px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SelectedResultItemWrapper = styled(ResultItemWrapper).attrs({
  depth: 1
})`
  display: block;
  width: 100%;
  height: 400px;
`;

const ResultItem = ({
  item,
  selected,
  onSelect,
  onSelectPrev,
  onSelectNext
}) => {
  return selected ? (
    <SelectedResultItemWrapper>
      {React.createElement(expandedContentByType[item.type], item)}
      <Button color='primary' disabled={!onSelectPrev} onClick={onSelectPrev}>
        &laquo;
      </Button>
      <Button color='primary' disabled={!onSelectNext} onClick={onSelectNext}>
        &raquo;
      </Button>
    </SelectedResultItemWrapper>
  ) : (
    <ResultItemWrapper onClick={onSelect}>
      {React.createElement(contentByType[item.type], item)}
    </ResultItemWrapper>
  );
};

export default ResultItem;
