import React from 'react';
import styled from 'styled-components';
import { Card } from 'react-components-kit';

const componentsByType = {
  picture: () => 'Picture',
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

const ResultItem = props => (
  <ResultItemWrapper>
    {React.createElement(componentsByType[props.item.type], props)}
  </ResultItemWrapper>
);

export default ResultItem;
