import React from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { noop } from 'lodash';

import {
  useFocusRing,
  mergeProps,
  useTable,
  useTableCell,
  useTableRow,
  useTableRowGroup,
  useTableHeaderRow,
  useTableColumnHeader,
} from 'react-aria';

// Not sure why these table exports are not available under main `react-stately` package...
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableState,
  useTableState,
} from '@react-stately/table';

import Stack from '../Stack';
import Icon from '../Icon';
import { flexCenter } from '~utils/styled';

export type SortDescriptor = NonNullable<
  Parameters<typeof useTableState>[0]['sortDescriptor']
>;

type RowStyle = 'default' | 'striped';

type Props = Parameters<typeof useTableState>[0] & {
  label: string;
  rowStyle?: RowStyle;
};

// Based on: https://react-spectrum.adobe.com/react-aria/useTable.html
// TODO: update react-aria package when legacy `ReactDOM.render` issue has been published
// Related issue: https://github.com/adobe/react-spectrum/issues/3147
export default function Table({
  label,
  rowStyle,
  children,
  sortDescriptor,
  onSortChange,
  ...rest
}: Props) {
  const state = useTableState({
    children,
    sortDescriptor,
    onSortChange,
  });

  const ref = React.useRef<any>();
  const { collection } = state;
  const { gridProps } = useTable({ 'aria-label': label }, state, ref);

  // NOTE: onMouseDown needs to be overwritten if we want text to be selectable
  return (
    <TableBase {...rest} {...gridProps} ref={ref} onMouseDown={noop}>
      <TableRowGroup>
        {collection.headerRows.map(headerRow => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map(column => (
              <TableColumnHeader
                key={column.key}
                column={column}
                state={state}
              />
            ))}
          </TableHeaderRow>
        ))}
      </TableRowGroup>

      <TableRowGroup>
        {[...collection.body.childNodes].map(row => (
          <TableRow key={row.key} item={row} state={state} rowStyle={rowStyle}>
            {[...row.childNodes].map(cell => (
              <TableCell key={cell.key} cell={cell} state={state} />
            ))}
          </TableRow>
        ))}
      </TableRowGroup>
    </TableBase>
  );
}

function TableRowGroup({ children }: { children: React.ReactNode }) {
  const { rowGroupProps } = useTableRowGroup();
  return <TableRowGroupBase {...rowGroupProps}>{children}</TableRowGroupBase>;
}

function TableColumnHeader({
  column,
  state,
}: {
  column: any;
  state: TableState<any>;
}) {
  const ref = React.useRef<any>();
  const { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  const arrowIcon =
    state.sortDescriptor?.direction === 'ascending'
      ? FaChevronUp
      : FaChevronDown;

  return (
    <TableColumnHeaderBase
      {...mergeProps(columnHeaderProps, focusProps)}
      $isFocusVisible={isFocusVisible}
      $isSortable={!!column.props.allowsSorting}
      ref={ref}
      className="table-header"
    >
      <Stack axis="x" spacing="xsmall" align="baseline">
        <span>{column.rendered ? column.rendered : ''}</span>
        {column.props.allowsSorting && (
          <TabletColumnSort>
            <TabletColumnSortIcon
              icon={arrowIcon}
              size={10}
              color="textMuted"
              aria-hidden="true"
            />
          </TabletColumnSort>
        )}
      </Stack>
    </TableColumnHeaderBase>
  );
}

function TableHeaderRow({
  item,
  state,
  children,
}: {
  item: any;
  state: TableState<any>;
  children: React.ReactNode;
}) {
  const ref = React.useRef<any>();
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <TableHeaderRowBase {...rowProps} ref={ref}>
      {children}
    </TableHeaderRowBase>
  );
}

function TableRow({
  item,
  children,
  state,
  rowStyle = 'default',
}: {
  item: any;
  state: TableState<any>;
  rowStyle?: RowStyle;
  children: React.ReactNode;
}) {
  const ref = React.useRef<any>();
  const isSelected = state.selectionManager.isSelected(item.key);
  const { rowProps } = useTableRow({ node: item }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <TableRowBase
      $isSelected={isSelected}
      $isFocusVisible={isFocusVisible}
      $rowStyle={rowStyle}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </TableRowBase>
  );
}

function TableCell({ cell, state }: { cell: any; state: TableState<any> }) {
  const ref = React.useRef<any>();
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <TableCellBase
      {...mergeProps(gridCellProps, focusProps)}
      $isFocusVisible={isFocusVisible}
      ref={ref}
      style={cell.props.style}
    >
      {cell.rendered}
    </TableCellBase>
  );
}

// TODO: add focus styles

const TableBase = styled.div`
  width: 100%;
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: ${p => p.theme.radii.small}px;
  overflow: hidden;
`;

const TableRowGroupBase = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabletColumnSortIcon = styled(Icon)`
  visibility: hidden;
`;

const TabletColumnSort = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: ${p => p.theme.radii.small}px;
  ${flexCenter}

  &:hover {
    background-color: ${p => p.theme.colors.hoverHighlight};
    ${TabletColumnSortIcon} {
      visibility: visible !important;
    }
  }
`;

const TableColumnHeaderBase = styled.div<{
  $isFocusVisible: boolean;
  $isSortable: boolean;
}>`
  flex: 1;
  padding: ${p => p.theme.spacing.small}px;
  color: ${p => p.theme.colors.text};
  outline: none;
  cursor: ${p => (p.$isSortable ? 'pointer' : 'default')};
  ${p => p.theme.typography.bodyStrong}

  &[aria-sort="ascending"],
  &[aria-sort="descending"] {
    ${TabletColumnSortIcon} {
      visibility: visible;
    }
  }

  &:hover {
    ${TabletColumnSortIcon} {
      visibility: visible !important;
    }

    ${TabletColumnSort} {
      background-color: ${p => p.theme.colors.muted5};
    }
  }
`;

const TableHeaderRowBase = styled.div`
  display: flex;
  border-bottom: 1px solid ${p => p.theme.colors.border};
  background-color: ${p => p.theme.colors.muted6};
`;

const TableRowBase = styled.div<{
  $isSelected: boolean;
  $isFocusVisible: boolean;
  $rowStyle: RowStyle;
}>`
  display: flex;
  outline: none;
  border-bottom: ${p =>
    p.$rowStyle === 'default' ? `1px solid ${p.theme.colors.border}` : 'none'};

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background-color: ${p =>
      p.$rowStyle === 'striped' ? p.theme.colors.muted6 : 'transparent'};
  }
`;

const TableCellBase = styled.div<{ $isFocusVisible: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  padding: ${p => p.theme.spacing.small}px;
  outline: none;
  color: ${p => p.theme.colors.text};
  ${p => p.theme.typography.body}
`;

// Bind helper components to `Table` for easier access in the app code
Table.Header = TableHeader;
Table.Column = Column;
Table.Body = TableBody;
Table.Row = Row;
Table.Cell = Cell;
