import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Button, Paper } from 'material-ui';

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

const appearAnimation = keyframes`
  from {
    opacity 0;
    transform: translateY(-22px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const StyledPaper = styled(Paper)`
  animation: ${appearAnimation} 0.8s forwards;
`;

const ResultItemWrapper = styled(StyledPaper)`
  display: inline-block;
  width: 200px;
  height: 128px;
  margin: 0 8px 8px 0;
  padding: 8px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SelectedResultItemWrapper = styled(ResultItemWrapper)`
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
