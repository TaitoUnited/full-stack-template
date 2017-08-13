import React from 'react';
import styled from 'styled-components';

import ExamplesNavi from './examples/examples-navi.component';

const RootNaviWrapper = styled.div`
  background-color: #eee;
  padding: 10px;
  min-width: 220px;

  display: flex;
  flex-direction: column;
  position: relative;
  @media print {
    display: none;
  }
`;

const RootNavi = () => (
  <RootNaviWrapper>
    <ExamplesNavi />
  </RootNaviWrapper>
);

export default RootNavi;
