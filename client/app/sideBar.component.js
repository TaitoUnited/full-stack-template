import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { Layout } from 'react-components-kit';
//
// const SideBarWrapper = styled(Layout)`
//   background-color: blue;
// `;

const SideBarWrapper = styled.div`
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

const InnerSideBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  @media print {
    display: none;
  }
`;

const SideBar = () => (
  <SideBarWrapper className='SideBar'>
    <InnerSideBarWrapper>
      <ul>
        <li><Link to='/files'>Files</Link></li>
        <li><Link to='/search'>Search</Link></li>
        <li><Link to='/report'>Report</Link></li>
        <li><Link to='/users'>Users</Link></li>
        <li><Link to='/ux'>UX</Link></li>
      </ul>
      <ul>
        <li><Link to='/old'>Old</Link></li>
      </ul>
    </InnerSideBarWrapper>
  </SideBarWrapper>
);

export default SideBar;
