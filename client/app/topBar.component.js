import React from 'react';
import styled from 'styled-components';
import { Layout, Icon, withRipple } from 'react-components-kit';

import BasicSearchContainer from './search/basicSearch.container';

const TopBarWrapper = styled(Layout)`
  padding: 16px 32px 16px 24px;
  background-color: #ffffff;
  border-bottom: 2px solid #f3f3f3;
`;

const Area = styled(Layout.Box)`
  margin-left: 32px;

  @media (max-width: 580px) {
    margin-left: 0;
  }
`;

const Logo = styled(Area)`
  width: 96px;
  vertical-align: middle;
  cursor: pointer;
  background-image: url('http://www.taitounited.fi/img/logo_vihrea_li.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;

  @media (max-width: 580px) {
    display: none;
  }
`;

// TODO directly for IconButton?
const IconWrapper = styled.div`
  cursor: pointer;
  vertical-align: middle;
  line-height: 24px;

  i {
    vertical-align: middle;
  }
`;

const IconButton = withRipple(Icon);

const TopBar = ({ onToggleMenu }) => (
  <TopBarWrapper className='TopBar'>
    <Layout.Box>
      <IconWrapper>
        <IconButton
          type='ion'
          name='navicon'
          size='24px'
          color='#A0A0A0'
          onClick={() => onToggleMenu()}
        />
      </IconWrapper>
    </Layout.Box>
    <Logo
      onClick={() => {
        window.location = 'http://www.taitounited.fi';
        return true;
      }}
    />
    <Area flex='1'>
      <BasicSearchContainer />
    </Area>
    <Area>
      <IconWrapper>
        <IconButton type='ion' name='person' size='24px' color='#A0A0A0' />
      </IconWrapper>
    </Area>
  </TopBarWrapper>
);

export default TopBar;
