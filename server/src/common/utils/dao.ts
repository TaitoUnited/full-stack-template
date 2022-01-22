import Boom from '@hapi/boom';
import { pgp } from '../setup/db';
import * as format from './format';
import { toSnakeCase } from './format';
import {
  Filter,
  FilterGroup,
  FilterOperator,
  FilterLogicalOperator,
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

export const getColumnNames = (
  object: any,
  convertDepth = false,
  tableName: string | null = null,
  excludeColumns: string[] = []
) => {
  return format
    .keysAsSnakeCaseArray(object, convertDepth)
    .filter((c) => !excludeColumns.includes(c))
    .map((c) => (tableName ? `${tableName}.${c}` : c));
};

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

function getFilterableColumnDefinition(
  field: string,
  filterableColumnNames: string[]
) {
  const columnDefinition = toSnakeCase(field, true);

  // Allow filtering with specific columns only
  if (filterableColumnNames.indexOf(columnDefinition) === -1) {
    throw Boom.badImplementation(
      `Filtering with column '${columnDefinition}' not allowed`
    );
  }

  return columnDefinition;
}

function getColumnTable(
  field: string,
  filterableColumnNames: string[],
  defaultTable?: string
) {
  const columnDefinition = getFilterableColumnDefinition(
    field,
    filterableColumnNames
  );
  return columnDefinition.indexOf('.') !== -1
    ? columnDefinition.split('.')[0]
    : defaultTable;
}

function getColumnName(field: string, filterableColumnNames: string[]) {
  const columnDefinition = getFilterableColumnDefinition(
    field,
    filterableColumnNames
  );
  return columnDefinition.indexOf('.') !== -1
    ? columnDefinition.split('.')[1]
    : columnDefinition;
}

/**
 * Function for parsing and generating a sql fragment
 * from a single filter object
 */
function generateFilterFragment<
  Item extends Record<string, any>,
  Key extends keyof Item
>(filter: Filter<Item, Key>) {
  if (filter.operator === FilterOperator.EQ) {
    return `= $(value)`;
  } else if (filter.operator === FilterOperator.NEQ) {
    return `!= $(value)`;
  } else if (filter.operator === FilterOperator.GT) {
    return `> $(value)`;
  } else if (filter.operator === FilterOperator.GTE) {
    return `>= $(value)`;
  } else if (filter.operator === FilterOperator.LT) {
    return `< $(value)`;
  } else if (filter.operator === FilterOperator.LTE) {
    return `<= $(value)`;
  } else if (filter.operator === FilterOperator.LIKE) {
    return `LIKE concat('%', $(value), '%')`;
  } else if (filter.operator === FilterOperator.ILIKE) {
    return `ILIKE concat('%', $(value), '%')`;
  }
  // makes typescript whine if a filterOperator is not being handled
  never(filter.operator);
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
 *     field: 'id',
 *     operator: FilterOperator.LIKE,
 *     value: '123',
 *     valueType: ValueType.TEXT,
 *   },
 *   {
 *     field: 'name',
 *     operator: FilterOperator.EXACT,
 *     value: 'John',
 *     valueType: ValueType.TEXT,
 *   },
 * ]);
 */
function createFilterFragment(
  filters: Filter<Record<string, any>, string>[],
  filterableColumnNames: string[],
  operator: FilterLogicalOperator,
  table?: string
) {
  const fragment = filters.reduce((str, cur, i) => {
    const columnTable = getColumnTable(cur.field, filterableColumnNames, table);
    const columnName = getColumnName(cur.field, filterableColumnNames);

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
      `${columnTable ? `$(columnTable~).` : ''}$(field~)${
        type ? `::${type}` : ''
      } ${clause}`,
      {
        ...cur,
        field: columnName,
        value: parseValue(cur.valueType, cur.value),
        columnTable,
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
  filterableColumnNames: string[],
  table: string,
  fallbackField = 'id'
) {
  const columnTable = getColumnTable(order.field, filterableColumnNames, table);
  const columnName = getColumnName(order.field, filterableColumnNames);

  return pgp.as.format(
    `
    ORDER BY $(columnTable~).$(columnName~) $(dir^), $(table~).$(fallbackField~)
  `,
    {
      columnTable,
      columnName,
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
  pagination: Pagination | null;

  selectColumnNames: string[];
  filterableColumnNames: string[];

  selectColumnsFragment?: string | null;
  joinFragment?: string;
  whereFragment?: string | null;
  searchFragment?: string | null;
  groupByFragment?: string;
};

export async function searchFromTable(p: searchFromTableParams) {
  const whereFragment = p.whereFragment || 'WHERE 1 = 1';
  const searchFragment = p.search ? p.searchFragment || '' : '';
  const filterFragment = createFilterGroupFragment(
    p.filterGroups,
    p.filterableColumnNames,
    p.tableName
  );
  const orderFragment = createOrderFragment(
    p.order,
    p.filterableColumnNames,
    p.tableName
  );
  const paginationFragment = p.pagination
    ? `OFFSET $[offset] LIMIT $[limit]`
    : '';

  const countQuery = `
    SELECT
      count(${p.tableName}.id)
    FROM ${p.tableName}
    ${p.joinFragment || ''}
    ${whereFragment}
    ${searchFragment || ''}
    ${filterFragment || ''}
  `;

  const countQueryParams = {
    search: p.search || undefined,
  };

  const countQueryData = await p.db.one(countQuery, countQueryParams);

  const query = `
    SELECT
      ${p.selectColumnNames.join(', ')}
      ${p.selectColumnsFragment || ''}
    FROM ${p.tableName}
    ${p.joinFragment || ''}
    ${whereFragment}
    ${searchFragment || ''}
    ${filterFragment || ''}
    ${p.groupByFragment || ''}
    ${orderFragment || ''}
    ${paginationFragment || ''}
  `;

  const queryParams = {
    ...p.pagination,
    search: p.search || undefined,
  };

  const queryData = await p.db.any(query, queryParams);

  return {
    total: Number(countQueryData.count),
    data: queryData,
  };
}
