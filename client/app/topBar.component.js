import React from 'react';
import styled from 'styled-components';
import { Layout, Icon, withRipple } from 'react-components-kit';

const TopBarWrapper = styled(Layout)`
  padding: 8px 16px;
  border-bottom: 1px solid black;
`;

const MenuButton = withRipple(Icon);

const TopBar = ({ actions }) => (
  <TopBarWrapper className='TopBar'>
    <MenuButton
      type='ion'
      name='navicon-round'
      size='32px'
      color='black'
      onClick={e => actions.onToggleMenu(e)}
    />
  </TopBarWrapper>
);

export default TopBar;
