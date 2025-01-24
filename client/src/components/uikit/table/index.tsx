import type { ComponentProps } from 'react';
import type { ColumnProps } from 'react-aria-components';
import {
  Column as AriaColumn,
  Table as AriaTable,
  Cell,
  Row,
  TableBody,
  TableHeader,
} from 'react-aria-components';

import { css, cva, cx } from '~/styled-system/css';

import { Icon } from '../icon';
import { Stack } from '../stack';

type RowStyle = 'default' | 'striped';

type Props = ComponentProps<typeof AriaTable> & {
  label: string;
  rowStyle?: RowStyle;
};

export type SortDescriptor = NonNullable<Props['sortDescriptor']>;

export function Table({
  label,
  rowStyle,
  children,
  className,
  ...props
}: Props) {
  return (
    <div className={wrapperStyles}>
      <AriaTable
        {...props}
        aria-label={label}
        className={cx(
          tableStyles({ striped: rowStyle === 'striped' }),
          className as string
        )}
      >
        {children}
      </AriaTable>
    </div>
  );
}

function Column({
  children,
  ...props
}: Omit<ColumnProps, 'children'> & { children?: React.ReactNode }) {
  return (
    <AriaColumn {...props}>
      {({ allowsSorting, sortDirection }) => (
        <Stack direction="row" gap="xxs">
          {children}
          {allowsSorting && (
            <span aria-hidden="true" className="sort-indicator">
              {sortDirection === 'ascending' ? (
                <Icon name="chevronDown" color="text" size={16} />
              ) : (
                <Icon name="chevronUp" color="text" size={16} />
              )}
            </span>
          )}
        </Stack>
      )}
    </AriaColumn>
  );
}

const wrapperStyles = css({
  width: '100%',
  borderWidth: '1px',
  borderColor: '$line3',
  borderRadius: '$small',
  overflow: 'hidden',
});

const tableStyles = cva({
  base: {
    width: '100%',
    borderCollapse: 'collapse',
    '& * :not([data-focus-visible])': {
      outline: 'none',
    },

    '& .react-aria-TableHeader': {
      borderBottom: '1px solid',
      borderColor: '$line3',
      backgroundColor: '$neutral5',
      textStyle: '$bodyBold',
    },

    '& .react-aria-Column': {
      textAlign: 'left',
      paddingBlock: '$small',
      paddingInline: '$regular',

      '&:not([data-sort-direction]) .sort-indicator': {
        visibility: 'hidden',
      },
    },

    '& .react-aria-Row': {
      borderBottom: '1px solid',
      borderColor: '$line3',

      '&:nth-child(even)': {
        backgroundColor: 'var(--stripe-color, transparent)',
      },
    },

    '& .react-aria-Cell': {
      textStyle: '$body',
      paddingBlock: '$small',
      paddingInline: '$regular',
    },
  },
  variants: {
    striped: {
      true: {
        '--stripe-color': 'token($colors.neutral5)',
      },
    },
  },
});

// Bind helper components to `Table` for easier access in the app code
Table.Header = TableHeader;
Table.Column = Column;
Table.Body = TableBody;
Table.Row = Row;
Table.Cell = Cell;
