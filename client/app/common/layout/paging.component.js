import React from 'react';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import { Layout, Dropmenu } from 'react-components-kit';
import * as fn from '~utils/fn.util';

const PagingWrapper = styled(Layout)``;

const Info = styled(Layout.Box)`
  display: ${props => (props.bottom ? 'none' : 'flex')};
  text-align: left;
  flex-direction: column;
  justify-content: center;
`;

const Actions = styled(Layout.Box)`
  display: ${props => (props.bottom ? 'none' : 'block')};
  text-align: right;
  button {
    padding-left: 0;
    padding-right: 0;
  }
`;

const PagerWrapper = styled(Layout.Box)`
  display: ${props => (props.bottom ? 'inline-block' : 'block')};
  text-align: center;

  /* Hide paging from top on a narrow screen */
  @media (max-width: 800px) {
    display: ${props =>
      !props.bottom && props.menuVisible ? 'none' : 'inline-block'};
  }
  @media (max-width: 560px) {
    display: ${props => (!props.bottom ? 'none' : 'inline-block')};
  }

  /* Pager buttons */
  > div {
    margin-right: 8px;
    /* Show buttons one below another on a narrow screen */
    @media (max-width: 600px) {
      display: ${props => (props.menuVisible ? 'block' : 'inline-block')};
    }
    @media (max-width: 380px) {
      display: block;
    }
  }
`;

const numOfPages = ({ criteria, results }) => {
  return Math.floor(results.totalNumOfItems / criteria.pageSize);
};

const PageMenu = ({ results, criteria, onSelectPage }) => (
  <Dropmenu
    onChange={e => onSelectPage(e.target.value)}
    trigger={
      <Button color='primary'>
        {criteria.page} / {numOfPages({ criteria, results })}
      </Button>
    }
  >
    {fn.times(numOfPages({ criteria, results }))(index => (
      <Dropmenu.Item key={index} value={index}>
        {index + 1}
      </Dropmenu.Item>
    ))}
  </Dropmenu>
);

const Pager = ({ results, criteria, onSelectPage, bottom, menuVisible }) => (
  <PagerWrapper flex={5} bottom={bottom} menuVisible={menuVisible}>
    <Button
      color='primary'
      onClick={() => {
        onSelectPage(criteria.page - 1);
      }}
    >
      &laquo; Edellinen
    </Button>
    <PageMenu
      criteria={criteria}
      results={results}
      onSelectPage={onSelectPage}
    />
    <Button
      color='primary'
      onClick={() => {
        onSelectPage(criteria.page + 1);
      }}
    >
      Seuraava &raquo;
    </Button>
  </PagerWrapper>
);

// TODO { criteria, onUpdateCriteria }
const FilterMenu = (criteria, onUpdateCriteria) => (
  <div>
    <Button
      onClick={() => {
        this.open = true;
      }}
      ref={button => {
        this.button = button;
      }}
    >
      Open Menu
    </Button>
    <Menu id='simple-menu' open anchorEl={this.button}>
      <MenuItem onClick={() => onUpdateCriteria()}>Profile</MenuItem>
      <MenuItem onClick={() => onUpdateCriteria()}>My account</MenuItem>
      <MenuItem onClick={() => onUpdateCriteria()}>Logout</MenuItem>
    </Menu>

    <Dropmenu
      value={criteria.sortBy}
      onChange={e => onUpdateCriteria('sortBy', e.target.value)}
      trigger={<Button color='primary'>{criteria.sortBy}-</Button>}
    >
      <Dropmenu.Item>1</Dropmenu.Item>
      <Dropmenu.Item>2</Dropmenu.Item>
      <Dropmenu.Item>3</Dropmenu.Item>
    </Dropmenu>
  </div>
);

const Paging = ({
  criteria,
  results,
  onUpdateCriteria,
  onSelectPage,
  bottom,
  menuVisible
}) => (
  <PagingWrapper centerSelf>
    <Info flex={1} bottom={bottom} menuVisible={menuVisible}>
      {results.totalNumOfItems} results
    </Info>
    <Pager
      flex={5}
      bottom={bottom}
      menuVisible={menuVisible}
      criteria={criteria}
      results={results}
      onSelectPage={onSelectPage}
    />
    <Actions flex={1} bottom={bottom} menuVisible>
      <FilterMenu criteria={criteria} onUpdateCriteria={onUpdateCriteria} />
    </Actions>
  </PagingWrapper>
);

// TODO propTypes for paging

export default Paging;
