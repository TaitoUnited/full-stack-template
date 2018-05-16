import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';

// const tooltipsByName = {
//   search: `
//     Demonstrates: redux, redux-saga, responsive layout, paging, caching,
//     full text search, json search, e2e tests and unit tests.
//   `,
//   files: `
//     Demonstrates: vanilla react, upload/download, buckets, postgres+json,
//     transactions, shuttle, cron jobs, joq queue, sms/email.
//   `,
//   report1: `
//     Demonstrates: react charts and PDF export using PhantomJS.
//   `,
//   report2: `
//     Demonstrates: PDF export using POD and excel export.
//   `,
//   users: `
//     Demonstrates: Auth0, Firebase, Wordpress and admin-on-rest integrations
//     for implementing login, terms agreement and user management.
//   `,
//   animations: `
//     Demonstrates animations.
//   `
// };

const StyledDrawer = styled(Drawer)`
  z-index: 1000 !important;
  > div {
    width: 224px;
    margin-top: 48px;
    padding: 24px 0;
  }
`;

const StyledTitle = styled(Typography).attrs({
  type: 'subheading',
  gutterBottom: true
})`
  padding-left: 24px;
  text-transform: uppercase;
  color: grey !important;
`;

const StyledLink = styled(Link)`
  > li {
    padding-left: 40px;
  }
  &:hover {
    text-decoration: none;
  }
`;

const SideBar = ({ menuVisible }) => (
  <StyledDrawer type='persistent' open={menuVisible}>
    <div>
      <StyledTitle>Examples</StyledTitle>

      <List>
        <StyledLink to='/search'>
          <ListItem button>
            <ListItemText primary='Search' />
          </ListItem>
        </StyledLink>
        <StyledLink to='/files'>
          <ListItem button>
            <ListItemText primary='Files' />
          </ListItem>
        </StyledLink>
        <StyledLink to='/reports/1'>
          <ListItem button>
            <ListItemText primary='Report 1' />
          </ListItem>
        </StyledLink>
        <StyledLink to='/reports/2'>
          <ListItem button>
            <ListItemText primary='Report 2' />
          </ListItem>
        </StyledLink>
        <StyledLink to='/users'>
          <ListItem button>
            <ListItemText primary='Users' />
          </ListItem>
        </StyledLink>
        <StyledLink to='/TODO'>
          <ListItem button>
            <ListItemText primary='Animations' />
          </ListItem>
        </StyledLink>
      </List>

      <StyledTitle>Example Layouts</StyledTitle>

      <List>
        <StyledLink to='/layouts/crud'>
          <ListItem button>
            <ListItemText primary='CRUD' />
          </ListItem>
        </StyledLink>
        <StyledLink to='/layouts/wizard'>
          <ListItem button>
            <ListItemText primary='Wizard' />
          </ListItem>
        </StyledLink>
        <StyledLink to='/layouts/infinite-wall'>
          <ListItem button>
            <ListItemText primary='Infinite wall' />
          </ListItem>
        </StyledLink>
      </List>

      <StyledTitle>Old</StyledTitle>

      <List>
        <StyledLink to='/old'>
          <ListItem button>
            <ListItemText primary='Old' />
          </ListItem>
        </StyledLink>
      </List>
    </div>
  </StyledDrawer>
);

export default SideBar;
