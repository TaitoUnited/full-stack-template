import React from 'react';
import styled from 'styled-components';
import { Layout } from 'react-components-kit';

const TopBarWrapper = styled(Layout)`
  background-color: blue;
`;

const TopBar = () => (
  <TopBarWrapper className='TopBar'>
    <div>jee</div>
  </TopBarWrapper>
);

export default TopBar;
