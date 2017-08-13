import React from 'react';
import styled from 'styled-components';

const ExamplesNaviWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  @media print {
    display: none;
  }
`;

const ExamplesNavi = () => (
  <ExamplesNaviWrapper>
    <ul>
      <li><a href='#ux'>UX</a></li>
      <li><a href='#users'>Users</a></li>
      <li><a href='#files'>Files</a></li>
      <li><a href='#report'>Report</a></li>
      <li><a href='#search'>Search</a></li>
    </ul>
    <ul>
      <li><a href='#old'>(old)</a></li>
    </ul>
  </ExamplesNaviWrapper>
);

export default ExamplesNavi;
