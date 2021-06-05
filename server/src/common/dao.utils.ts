import {
  Filter,
  FilterType,
  Order,
  OrderDirection,
  ValueType,
} from '../../shared/types/common';
import { pgp } from './db';

// TODO: check that createFilterFragment and createOrderFragment
// implementations are ok (no SQL injection)

function never(arg: never): never {
  throw new Error();
}

/**
 * Parse `value` as per the supplied `ValueType`
 */
function parseValue(type: ValueType, value: string) {
  if (type === ValueType.TEXT) {
    return value;
  }
  if (type === ValueType.DATE) {
    return new Date(value);
  }
  if (type === ValueType.NUMBER) {
    return Number(value);
  }
  never(type);
}

/**
 * Function for parsing and generating a sql fragment
 * from a single filter object
 */
function generateFilterFragment<
  Item extends Record<string, any>,
  Key extends keyof Item
>(filter: Filter<Item, Key>) {
  if (filter.type === FilterType.EXACT) {
    return `= $(value)`;
  } else if (filter.type === FilterType.LIKE) {
    return `ilike concat('%', $(value), '%')`;
  }
  // makes typescript whine if a filterType is not being handled
  never(filter.type);
}

/**
 * Create a sql fragment from multiple filter objects
 *
 * @example
 *
 * // resolves to:
 * // "id"::text ilike concat('%', '123', '%') and "name"::text = 'Jamppa'
 * createFilterFragment([
 *   {
 *     type: FilterType.LIKE,
 *     field: 'id',
 *     value: '123',
 *     valueType: ValueType.TEXT,
 *   },
 *   {
 *     type: FilterType.EXACT,
 *     field: 'name',
 *     value: 'John',
 *     valueType: ValueType.TEXT,
 *   },
 * ]);
 */
export function createFilterFragment(
  filters: Filter<Record<string, any>, string>[],
  table?: string
) {
  const fragment = filters.reduce((str, cur, i) => {
    // just in case since we are injecting the `i`
    // directly into the sql
    if (typeof i !== 'number') {
      return str;
    }

    const prefix = i === 0 ? 'where' : 'and';

    const clause = generateFilterFragment(cur);

    // cast sql types to correct ones, e.g. when comparing uuid = text
    // and find it from the enum because I'm paranoid
    const type = Object.values(ValueType).find(
      (type) => type === cur.valueType
    );

    // use pg-promise's formatting engine to format the
    // field and value to the fragment before making
    // the actual query
    // should be pretty safe in regards to sql injection risk
    const currentFragment = pgp.as.format(
      `${table ? `$(table~).` : ''}$(field~)${
        type ? `::${type}` : ''
      } ${clause}`,
      {
        ...cur,
        value: parseValue(cur.valueType, cur.value),
        table,
      }
    );
    return `${str}${prefix} ${currentFragment} `;
  }, '');

  return fragment;
}

export function createOrderFragment(
  order: Order,
  table: string,
  fallbackField = 'id'
) {
  return pgp.as.format(
    `
    order by $(field~) $(dir^), $(table~).$(fallbackField~)
  `,
    {
      field: order.field,
      dir: order.dir === OrderDirection.ASC ? 'asc' : 'desc',
      fallbackField,
      table,
    }
  );
}
