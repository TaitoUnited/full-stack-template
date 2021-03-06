import Boom from '@hapi/boom';
import { pgp } from '../setup/db';
import * as format from './format';
import { toSnakeCase } from './format';
import {
  Filter,
  FilterGroup,
  FilterType,
  FilterOperator,
  Order,
  OrderDirection,
  Pagination,
  ValueType,
} from '../types/search';

export const formatTableColumnNames = (
  tableName: string,
  columns: string[]
) => {
  return columns.map(
    (column) => `${toSnakeCase(tableName)}.${toSnakeCase(column)}`
  );
};

export const getTableColumnNames = (tableName: string, object: any) => {
  return formatTableColumnNames(tableName, Object.getOwnPropertyNames(object));
};

export const formatColumnNames = format.toSnakeCaseArray;

export const getColumnNames = format.keysAsSnakeCaseArray;

export const formatParameterNames = (columns: string[]) => {
  return columns.map((column) => `$[${toSnakeCase(column)}]`);
};

export const getParameterNames = (object: any) => {
  return formatParameterNames(Object.getOwnPropertyNames(object));
};

export const formatParameterValues = (names: string[], obj: any) => {
  const newObj: any = {};
  for (const name of names) {
    const val = obj[name];
    newObj[toSnakeCase(name)] = val === undefined ? null : val;
  }
  return newObj;
};

export const getParameterValues = (p: { allowedKeys: any; values: any }) => {
  const keys = Array.isArray(p.allowedKeys)
    ? p.allowedKeys
    : Object.getOwnPropertyNames(p.allowedKeys);
  return formatParameterValues(keys, p.values);
};

export const getParameterAssignments = (p: {
  allowedKeys: any;
  values?: any;
}) => {
  const assignments = [];

  const keys = Array.isArray(p.allowedKeys)
    ? p.allowedKeys
    : Object.getOwnPropertyNames(p.allowedKeys);
  for (const key of keys) {
    if (!p.values || p.values[key] !== undefined) {
      assignments.push(`${toSnakeCase(key)} = $[${toSnakeCase(key)}]`);
    }
  }

  return assignments;
};

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
  if (filter.type === FilterType.EQ) {
    return `= $(value)`;
  } else if (filter.type === FilterType.NEQ) {
    return `!= $(value)`;
  } else if (filter.type === FilterType.GT) {
    return `> $(value)`;
  } else if (filter.type === FilterType.GTE) {
    return `>= $(value)`;
  } else if (filter.type === FilterType.LT) {
    return `< $(value)`;
  } else if (filter.type === FilterType.LTE) {
    return `<= $(value)`;
  } else if (filter.type === FilterType.LIKE) {
    return `LIKE concat('%', $(value), '%')`;
  } else if (filter.type === FilterType.ILIKE) {
    return `ILIKE concat('%', $(value), '%')`;
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
function createFilterFragment(
  filters: Filter<Record<string, any>, string>[],
  filterableColumnNames: string[],
  operator: FilterOperator,
  table?: string
) {
  const fragment = filters.reduce((str, cur, i) => {
    const columnName = toSnakeCase(cur.field);

    // Allow filtering with specific columns only
    if (filterableColumnNames.indexOf(columnName) === -1) {
      throw Boom.badImplementation(
        `Filtering with column '${columnName}' not allowed`
      );
    }

    // just in case since we are injecting the `i`
    // directly into the sql
    if (typeof i !== 'number') {
      throw Boom.badImplementation(`i ${i} not a number`);
    }

    const prefix = i === 0 ? '' : operator.toString();

    const clause = generateFilterFragment(cur);

    // cast sql types to correct ones, e.g. when comparing uuid = text
    // and find it from the enum because I'm paranoid
    const type = Object.values(ValueType).find(
      (type) => type === cur.valueType
    );

    // use pg-promise's formatting engine to format the
    // field and value to the fragment before making the query
    // TODO: even safer might be to collect field values to a separate
    // parameter list given for pg-promise as parameters.
    const currentFragment = pgp.as.format(
      `${table ? `$(table~).` : ''}$(field~)${
        type ? `::${type}` : ''
      } ${clause}`,
      {
        ...cur,
        field: toSnakeCase(cur.field, false),
        value: parseValue(cur.valueType, cur.value),
        table,
      }
    );
    return `${str}${prefix} ${currentFragment} `;
  }, '');

  return `( ${fragment} )`;
}

function createFilterGroupFragment(
  filterGroups: FilterGroup<Record<string, any>>[],
  filterableColumnNames: string[],
  table?: string
) {
  return filterGroups.reduce((str, cur) => {
    const currentFragment = createFilterFragment(
      cur.filters,
      filterableColumnNames,
      cur.operator,
      table
    );
    return `${str} AND ${currentFragment} `;
  }, '');
}

function createOrderFragment(
  order: Order,
  table: string,
  fallbackField = 'id'
) {
  return pgp.as.format(
    `
    ORDER BY $(field~) $(dir^), $(table~).$(fallbackField~)
  `,
    {
      field: toSnakeCase(order.field),
      dir: order.dir === OrderDirection.ASC ? 'ASC' : 'DESC',
      fallbackField: toSnakeCase(fallbackField),
      table,
    }
  );
}

export type searchFromTableParams = {
  tableName: string;
  db: any; // TODO: should be Db
  search?: string | null;
  filterGroups: FilterGroup<any>[]; // TODO: should be FilterGroup<Record<string, any>>[],
  order: Order;
  pagination: Pagination;
  searchFragment: string;
  selectColumnNames: string[];
  filterableColumnNames: string[];
  noDeletedFragment?: string | null;
};

export async function searchFromTable(p: searchFromTableParams) {
  const basicFragment = p.noDeletedFragment || 'WHERE 1 = 1';
  const filterFragment = createFilterGroupFragment(
    p.filterGroups,
    p.filterableColumnNames,
    p.tableName
  );
  const orderFragment = createOrderFragment(p.order, p.tableName);

  const count = await p.db.one(
    `
      SELECT count(id) FROM ${p.tableName}
      ${basicFragment}
      ${p.searchFragment}
      ${filterFragment}
    `,
    {
      search: p.search || undefined,
    }
  );

  const data = await p.db.any(
    `
      SELECT ${p.selectColumnNames.join(', ')} FROM ${p.tableName}
      ${basicFragment}
      ${p.searchFragment}
      ${filterFragment}
      ${orderFragment}
      OFFSET $[offset] LIMIT $[limit]
    `,
    {
      ...p.pagination,
      search: p.search || undefined,
    }
  );

  return {
    total: Number(count.count),
    data,
  };
}
