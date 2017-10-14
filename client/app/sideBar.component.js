import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from 'react-components-kit';

const SideBarWrapper = styled(Layout.Box)`
  display: ${props => props.menuVisible ? 'block' : 'none'};
  background-color: #eee;
  padding: 10px;
  min-width: 220px;
  @media print {
    display: none;
  }
`;

const SideBar = ({ menuVisible }) => (
  <SideBarWrapper className='SideBar' menuVisible={menuVisible}>
    <ul>
      <li><Link to='/search'>Search</Link></li>
      <li><Link to='/reports'>Reports</Link></li>
      <li><Link to='/files'>Files</Link></li>
      <li><Link to='/users'>Users</Link></li>
      <li><Link to='/ux'>UX</Link></li>
    </ul>
    <ul>
      <li><Link to='/old'>Old</Link></li>
    </ul>
  </SideBarWrapper>
);

export default SideBar;
