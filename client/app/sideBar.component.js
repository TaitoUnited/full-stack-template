import React from 'react';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Tooltip from 'material-ui/Tooltip';
import styled from 'styled-components';
import { Layout } from 'react-components-kit';

const tooltipsByName = {
  search: `
    Demonstrates: redux, redux-saga, responsive layout, paging, caching,
    full text search, json search, e2e tests and unit tests.
  `,
  files: `
    Demonstrates: vanilla react, upload/download, buckets, postgres+json,
    transactions, shuttle, cron jobs, joq queue, sms/email.
  `,
  report1: `
    Demonstrates: react charts and PDF export using PhantomJS.
  `,
  report2: `
    Demonstrates: PDF export using POD and excel export.
  `,
  users: `
    Demonstrates: Auth0, Firebase, Wordpress and admin-on-rest integrations
    for implementing login, terms agreement and user management.
  `,
  animations: `
    Demonstrates animations.
  `
};

const SideBarWrapper = styled(Layout.Box)`
  display: ${props => (props.menuVisible ? 'block' : 'none')};
  background-color: #f5f5f5;
  min-width: 216px;

  @media (max-width: 320px) {
    width: 216px;
  }

  @media print {
    display: none;
  }
`;

const MenuLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

const SideBar = ({ menuVisible }) => (
  <SideBarWrapper className='SideBar' menuVisible={menuVisible}>
    <Typography type='subheading' gutterBottom>
      Examples
    </Typography>

    <List>
      <Tooltip title={tooltipsByName.search} placement='right'>
        <MenuLink to='/search'>
          <ListItem button>
            <ListItemText primary='Search' />
          </ListItem>
        </MenuLink>
      </Tooltip>
      <Tooltip title={tooltipsByName.files} placement='right'>
        <MenuLink to='/files'>
          <ListItem button>
            <ListItemText primary='Files' />
          </ListItem>
        </MenuLink>
      </Tooltip>
      <Tooltip title={tooltipsByName.report1} placement='right'>
        <MenuLink to='/reports/1'>
          <ListItem button>
            <ListItemText primary='Report 1' />
          </ListItem>
        </MenuLink>
      </Tooltip>
      <Tooltip title={tooltipsByName.report2} placement='right'>
        <MenuLink to='/reports/2'>
          <ListItem button>
            <ListItemText primary='Report 2' />
          </ListItem>
        </MenuLink>
      </Tooltip>
      <Tooltip title={tooltipsByName.users} placement='right'>
        <MenuLink to='/users'>
          <ListItem button>
            <ListItemText primary='Users' />
          </ListItem>
        </MenuLink>
      </Tooltip>
      <Tooltip title={tooltipsByName.animations} placement='right'>
        <MenuLink to='/TODO'>
          <ListItem button>
            <ListItemText primary='Animations' />
          </ListItem>
        </MenuLink>
      </Tooltip>
    </List>

    <Typography type='subheading' gutterBottom>
      Old
    </Typography>

    <List>
      <Tooltip title={tooltipsByName.old} placement='right'>
        <MenuLink to='/old'>
          <ListItem button>
            <ListItemText primary='Old' />
          </ListItem>
        </MenuLink>
      </Tooltip>
    </List>

    <Typography type='subheading' gutterBottom>
      Example Layouts
    </Typography>

    <List>
      <Tooltip title={tooltipsByName.crud} placement='right'>
        <MenuLink to='/layouts/crud'>
          <ListItem button>
            <ListItemText primary='CRUD' />
          </ListItem>
        </MenuLink>
      </Tooltip>
      <Tooltip title={tooltipsByName.wizard} placement='right'>
        <MenuLink to='/layouts/wizard'>
          <ListItem button>
            <ListItemText primary='Wizard' />
          </ListItem>
        </MenuLink>
      </Tooltip>
      <Tooltip title={tooltipsByName.infiniteWall} placement='right'>
        <MenuLink to='/layouts/infinite-wall'>
          <ListItem button>
            <ListItemText primary='Infinite wall' />
          </ListItem>
        </MenuLink>
      </Tooltip>
    </List>
  </SideBarWrapper>
);

export default SideBar;
