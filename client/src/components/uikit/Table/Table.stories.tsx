import { useState } from 'react';
import { orderBy, random, range } from 'lodash';

import Table, { SortDescriptor } from './index';
import { styled } from '~styled-system/jsx';

export default {
  title: 'Table',
  component: Table,
};

type TableRow = {
  id: number;
  name: string;
  age: number;
  location: string;
};

const data: TableRow[] = range(100).map(i => ({
  id: i,
  name: `Name ${i + 1}`,
  age: random(10, 60),
  location: `Address ${i + 1}, Espoo`,
}));

const SORT_DIRECTION = {
  ascending: 'asc' as const,
  descending: 'desc' as const,
};

export function Basic() {
  return (
    <Wrapper>
      <Table label="Test table">
        <Table.Header>
          <Table.Column key="name" isRowHeader>
            Name
          </Table.Column>
          <Table.Column key="age">Age</Table.Column>
          <Table.Column key="location">Location</Table.Column>
        </Table.Header>

        <Table.Body>
          {data.slice(0, 15).map(d => (
            <Table.Row key={d.id}>
              <Table.Cell key="name">{d.name}</Table.Cell>
              <Table.Cell key="age">{d.age}</Table.Cell>
              <Table.Cell key="location">{d.location}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Wrapper>
  );
}

export function Striped() {
  return (
    <Wrapper>
      <Table label="Test table" rowStyle="striped">
        <Table.Header>
          <Table.Column key="name" isRowHeader>
            Name
          </Table.Column>
          <Table.Column key="age">Age</Table.Column>
          <Table.Column key="location">Location</Table.Column>
        </Table.Header>

        <Table.Body>
          {data.slice(0, 15).map(d => (
            <Table.Row key={d.id}>
              <Table.Cell key="name">{d.name}</Table.Cell>
              <Table.Cell key="age">{d.age}</Table.Cell>
              <Table.Cell key="location">{d.location}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Wrapper>
  );
}

export function Sortable() {
  const [sort, setSort] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const sorted = orderBy(
    data,
    sort?.column || 'name',
    sort?.direction ? SORT_DIRECTION[sort.direction] : 'asc'
  );

  return (
    <Wrapper>
      <Table
        label="Test table"
        rowStyle="striped"
        sortDescriptor={sort}
        onSortChange={setSort}
      >
        <Table.Header>
          <Table.Column key="name" allowsSorting isRowHeader>
            Name
          </Table.Column>
          <Table.Column key="age" allowsSorting>
            Age
          </Table.Column>
          <Table.Column key="location" allowsSorting>
            Location
          </Table.Column>
        </Table.Header>

        <Table.Body>
          {sorted.map(d => (
            <Table.Row key={d.id}>
              <Table.Cell key="name">{d.name}</Table.Cell>
              <Table.Cell key="age">{d.age}</Table.Cell>
              <Table.Cell key="location">{d.location}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  base: {
    backgroundColor: '$surface',
    padding: '$medium',
  },
});
