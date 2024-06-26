import { ComponentProps } from 'react';

import {
  Cell,
  Column,
  Row,
  Table as AriaTable,
  TableBody,
  TableHeader,
} from 'react-aria-components';

import { css, cva, cx } from '~styled-system/css';

type RowStyle = 'default' | 'striped';

type Props = ComponentProps<typeof AriaTable> & {
  label: string;
  rowStyle?: RowStyle;
};

export type SortDescriptor = NonNullable<Props['sortDescriptor']>;

// TODO: figure out how to render the sort icon

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
