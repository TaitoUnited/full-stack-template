import Boom from '@hapi/boom';

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

import * as format from './format';
import { pgp } from '../setup/db';
import { toSnakeCase, toCamelCase } from './format';

/**
 * Returns keys of an object as valid database table column names.
 *
 * @param options.schema The object schema
 * @param options.convertDepth If true, _ is converted to . ('eName_cName' -> 'e_name.c_name')
 * @param options.tableName Table name to be added as column name prefix, or null.
 * @param options.excludeColumns Optional list of column names to be excluded.
 * @param options.casts Map of column names to their respective cast types.
 * @returns Each column as 'table_name.column_name'
 */
export function getColumnNames<T extends Record<string, any>>({
  schema,
  tableName,
  convertDepth,
  excludeColumns = [],
  casts = {},
}: {
  schema: T;
  tableName?: string;
  convertDepth?: boolean;
  excludeColumns?: Array<keyof T>;
  casts?: Partial<Record<keyof T, string>>;
}) {
  return format
    .keysAsSnakeCaseArray(schema, convertDepth)
    .filter((col) => !excludeColumns.includes(col))
    .map((col) => `${col}${casts[toCamelCase(col)] || ''}`)
    .map((col) => (tableName ? `${tableName}.${col}` : col));
}

/**
 * Returns keys of an object as arameter names to be added for example
 * in an INSERT statement values section.
 *
 * @param options.schema The object schema
 * @param options.casts Map of column names to their respective cast types.
 * @returns Each column as '$[column_name]'
 */
export function getParameterNames<T extends Record<string, any>>({
  schema,
  casts = {},
}: {
  schema: T;
  casts?: Partial<Record<keyof T, string>>;
}) {
  const columns = Object.getOwnPropertyNames(schema);
  return columns
    .map((col) => `$[${toSnakeCase(col)}]`)
    .map((col, i) => `${col}${casts[columns[i]] || ''}`);
}

const formatParameterValues = (names: string[], obj: any) => {
  const newObj: any = {};
  for (const name of names) {
    const val = obj[name];
    newObj[toSnakeCase(name)] = val === undefined ? null : val;
  }
  return newObj;
};

/**
 * Returns formatted values for an UPDATE statement.
 *
 * @returns Record with field name as key and field value as value.
 */
export const getParameterValues = (p: {
  /**
   * Array or object that specifies the allowed fields in camelCase.
   */
  allowedKeys: any[] | Record<string, any>;
  /**
   * Field values to be updated.
   */
  values: Record<string, any>;
}): Record<string, any> => {
  const keys = Array.isArray(p.allowedKeys)
    ? p.allowedKeys
    : Object.getOwnPropertyNames(p.allowedKeys);
  return formatParameterValues(keys, p.values);
};

/**
 * Returns parameter assigments to be added to an UPDATE statement.
 *
 * @param options.values Field values to be updated.
 * @param options.allowedKeys Array or object that specifies the allowed fields in camelCase.
 * @param options.casts Map of column names to their respective cast types.
 * @returns Assignments, for example ['id = $[id]', 'creation_date = $[creation_date]']
 */
export function getParameterAssignments<T extends Record<string, any>>({
  values,
  allowedKeys,
  casts = {},
}: {
  values: T;
  allowedKeys: Array<keyof T> | Partial<T>;
  casts?: Partial<Record<keyof T, string>>;
}) {
  const assignments = [];

  const keys = Array.isArray(allowedKeys)
    ? allowedKeys
    : Object.getOwnPropertyNames(allowedKeys);

  for (const key of keys) {
    if (!values || values[key] !== undefined) {
      const cast = casts[key] || '';
      const col = toSnakeCase(key as string);
      const assignment = `${col} = $[${col}]${cast}`;
      assignments.push(assignment);
    }
  }

  // In case there are no assignments, we return dummy id=id assignment to make sure
  // SQL statement is valid
  return assignments.length > 0 ? assignments : ['id=id'];
}

function never(arg: never): never {
  throw new Error();
}

/**
 * Parse `value` as per the supplied `ValueType`
 */
function parseValue(type: ValueType, value: string | null) {
  if (type === ValueType.TEXT) {
    return value;
  }
  if (type === ValueType.DATE) {
    return value != null ? new Date(value) : null;
  }
  if (type === ValueType.NUMBER) {
    return value != null ? Number(value) : null;
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
  const table =
    columnDefinition.indexOf('.') !== -1
      ? columnDefinition.split('.')[0]
      : defaultTable;
  // TODO: define these mappings somewhere else.
  return table === 'user' ? 'app_user' : table;
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
  Key extends keyof Item,
>(filter: Filter<Item, Key>) {
  if (filter.operator === FilterOperator.EQ && filter.value === null) {
    return `IS NULL`;
  } else if (filter.operator === FilterOperator.NEQ && filter.value === null) {
    return `IS NOT NULL`;
  } else if (filter.operator === FilterOperator.EQ) {
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
  if (filters.length === 0) {
    return undefined;
  }

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

/**
 * Returns filters to be added to a select statement.
 *
 * @param filterGroups
 * @param filterableColumnNames
 * @param table
 * @returns
 */
export function createFilterGroupFragment(
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
    if (!currentFragment) {
      return str;
    }
    return `${str} AND ${currentFragment} `;
  }, '');
}

function disableOrderColumnTablePrefix(
  orderField: string,
  customSelectColumnNames?: string[],
  disableOrderColumnTablePrefix?: boolean
) {
  if (disableOrderColumnTablePrefix) return true;

  // When ordering be custom select column, we cannot add table prefix
  // to the field.
  if (
    customSelectColumnNames &&
    customSelectColumnNames.includes(toSnakeCase(orderField))
  ) {
    return true;
  }

  return false;
}

/**
 * Returns order by statement that should be added to a select statement.
 *
 * @param order
 * @param filterableColumnNames
 * @param table
 * @param fallbackField
 * @returns
 */
function createOrderFragmentImpl(
  order: Order,
  filterableColumnNames: string[],
  customSelectColumnNames: string[],
  table: string,
  fallbackField: string | null,
  disableTablePrefix = false
) {
  if (disableOrderColumnTablePrefix(order.field, customSelectColumnNames)) {
    disableTablePrefix = true;
  }

  const columnTable = getColumnTable(order.field, filterableColumnNames, table);
  const columnName = getColumnName(order.field, filterableColumnNames);

  const tablePrefixFragment = disableTablePrefix ? '' : '$(table~).';
  const columnTablePrefixFragment = disableTablePrefix
    ? ''
    : '$(columnTable~).';
  const fallbackFieldFrag = fallbackField
    ? `, ${tablePrefixFragment}$(fallbackField~)`
    : '';

  let nullInvertFrag = '';
  if (order.invertNullOrder) {
    nullInvertFrag =
      order.dir === OrderDirection.ASC ? ' NULLS FIRST' : ' NULLS LAST';
  }

  return pgp.as
    .format(
      `
      ${columnTablePrefixFragment}$(columnName~)
      $(dir^)${nullInvertFrag}${fallbackFieldFrag}
  `,
      {
        columnTable,
        columnName,
        dir: order.dir === OrderDirection.ASC ? 'ASC' : 'DESC',
        fallbackField: fallbackField ? toSnakeCase(fallbackField) : null,
        table,
      }
    )
    .trim();
}

/**
 * Returns order by statement that should be added to a select statement.
 *
 * @param order
 * @param filterableColumnNames
 * @param table
 * @param fallbackField
 * @returns
 */
function createOrderFragment(
  orders: Order[],
  filterableColumnNames: string[],
  customSelectColumnNames: string[],
  table: string,
  fallbackField: string | null, // TODO: can we remove this?
  disableTablePrefix = false
) {
  const fragments = orders.map((order) =>
    createOrderFragmentImpl(
      order,
      filterableColumnNames,
      customSelectColumnNames,
      table,
      null,
      disableTablePrefix
    )
  );
  return `ORDER BY ${fragments.join(', ')}`;
}

/**
 * Returns additional columns that should be added to a select statement
 * to enable order by using the columns.
 *
 * @param order
 * @param filterableColumnNames
 * @param selectColumnNames
 * @param table
 * @returns
 */
function createOrderAddedColumnFragment(
  orders: Order[],
  filterableColumnNames: string[],
  selectColumnNames: string[],
  customSelectColumnNames: string[],
  table: string,
  disableAddedOrderColumn?: boolean
) {
  const fragments = orders.map((order) => {
    const columnTable = getColumnTable(
      order.field,
      filterableColumnNames,
      table
    );
    const columnName = getColumnName(order.field, filterableColumnNames);
    const name = `${columnTable}.${columnName}`;

    const disable = disableOrderColumnTablePrefix(
      order.field,
      customSelectColumnNames,
      disableAddedOrderColumn
    );

    return disable || selectColumnNames.includes(name)
      ? ''
      : `${name} AS added_order_by_column`;
  });

  const addedColumns = fragments
    .filter((f) => !!f.trim())
    .join(', ')
    .trim();

  return addedColumns ? `, ${addedColumns}` : '';
}

/**
 * Returns additional group by columns that should be added to a select statement
 * to enable order by using the columns.
 *
 * @param order
 * @param filterableColumnNames
 * @param selectColumnNames
 * @param table
 * @returns
 */
function createGroupByColumnsFragment(
  orders: Order[],
  filterableColumnNames: string[],
  selectColumnNames: string[],
  customSelectColumnNames: string[],
  table: string,
  disableAddedOrderColumn?: boolean
) {
  const added = createOrderAddedColumnFragment(
    orders,
    filterableColumnNames,
    selectColumnNames,
    customSelectColumnNames,
    table,
    disableAddedOrderColumn
  );
  return added ? ', added_order_by_column' : '';
}

export type SearchFromTableParams = {
  /** Database table name */
  tableName: string;
  /** Database tool */
  db: any; // TODO: should be Db
  /** Freely written search text */
  search?: string | null;
  /** Filters */
  filterGroups: FilterGroup<any>[]; // TODO: should be FilterGroup<Record<string, any>>[],
  /** Order */
  order: Order | Order[];
  /** Pagination */
  pagination?: Pagination;
  /** Additional parameters for query */
  queryParams?: Record<string, string | null | undefined> | null;

  /** columns added to the select statement */
  selectColumnNames: string[];
  /** custom columns added manually to the select fragment */
  customSelectColumnNames?: string[];
  /** columns that can be used for filtering and ordering */
  filterableColumnNames: string[];

  /** select columns fragment to be added to the select statement */
  selectColumnsFragment?: string | null;
  /** JOIN fragment to be added to the select statement */
  joinFragment?: string;
  /** 1-N UNIONs to be added to the select statement */
  unionsFragment?: string | null;
  /** WHERE fragment to be added to the select statement */
  whereFragment?: string | null;
  /** search filters fragment to be added to the select statement */
  searchFragment?: string | null;
  /** GROUP BY fragment to be added to the select statement */
  groupByFragment?: string;
  /** HAVING fragment to be added to the select statement */
  havingFragment?: string;

  /** Does not use DISTINCT in select statement if true */
  disableDistinct?: boolean;
  /** Does not add additional order by column to select statement if true */
  disableAddedOrderColumn?: boolean;
  /** Does not add table prefix on ORDER BY statement if true */
  disableOrderColumnTablePrefix?: boolean;
  /** Does not add order by fallback field if true */
  disableOrderColumnFallback?: boolean;
  /** Does not return total count if true */
  disableTotalCountResult?: boolean;
  /** Does not return data if true */
  disableDataResult?: boolean;

  /** Logs sql queries to console.log() */
  debugSql?: boolean;
};

/**
 * Searches data from a table based on given search parameters.
 *
 * @param parameters
 * @returns { total, data }
 */
export async function searchFromTable(p: SearchFromTableParams) {
  const order = Array.isArray(p.order) ? p.order : [p.order];

  const whereFragment = p.whereFragment || 'WHERE 1 = 1';
  const searchFragment = p.search ? p.searchFragment || '' : '';
  const filterFragment = createFilterGroupFragment(
    p.filterGroups,
    p.filterableColumnNames,
    p.tableName
  );
  const orderFragment = createOrderFragment(
    order,
    p.filterableColumnNames,
    p.customSelectColumnNames || [],
    p.tableName,
    p.disableOrderColumnFallback === true ? null : 'id',
    p.disableOrderColumnTablePrefix
  );
  const orderAddedColumnFragment = createOrderAddedColumnFragment(
    order,
    p.filterableColumnNames,
    p.selectColumnNames,
    p.customSelectColumnNames || [],
    p.tableName,
    p.disableAddedOrderColumn
  );
  const groupByColumnsFragment = createGroupByColumnsFragment(
    order,
    p.filterableColumnNames,
    p.selectColumnNames,
    p.customSelectColumnNames || [],
    p.tableName,
    p.disableAddedOrderColumn
  );

  const paginationFragment = p.pagination
    ? `OFFSET $[offset] LIMIT $[limit]`
    : '';

  const countQueryFilters = `
    FROM ${p.tableName}
    ${p.joinFragment || ''}
    ${whereFragment}
    ${searchFragment || ''}
    ${filterFragment || ''}
    ${p.unionsFragment || ''}
  `;

  const countQuery = p.havingFragment
    ? `
      SELECT count(${p.tableName}.id) FROM (
        SELECT 
          ${p.selectColumnsFragment || ''}
          ${p.tableName}.id
        ${countQueryFilters}
        GROUP BY ${p.tableName}.id
        ${p.havingFragment}
      ) ${p.tableName}
    `
    : `
      SELECT
        count(DISTINCT ${p.tableName}.id)
      ${countQueryFilters}
    `;

  const countQueryParams = {
    search: p.search || undefined,
    ...p.queryParams,
  };

  if (p.debugSql) {
    console.log(countQuery);
  }

  const countQueryData = p.disableTotalCountResult
    ? { count: -1 }
    : await p.db.one(countQuery, countQueryParams);

  const query = `
    SELECT
      ${p.disableDistinct ? '' : 'DISTINCT'}
      ${p.selectColumnsFragment || ''}
      ${p.selectColumnNames.join(', ')}
      ${orderAddedColumnFragment}
    FROM ${p.tableName}
    ${p.joinFragment || ''}
    ${whereFragment}
    ${searchFragment || ''}
    ${filterFragment || ''}
    ${p.unionsFragment || ''}
    ${p.groupByFragment || ''}
    ${p.groupByFragment ? groupByColumnsFragment : ''}
    ${p.havingFragment || ''}
    ${orderFragment || ''}
    ${paginationFragment || ''}
  `;

  const queryParams = {
    ...p.pagination,
    search: p.search || undefined,
    ...p.queryParams,
  };

  if (p.debugSql) {
    console.log(query);
  }

  const queryData = p.disableDataResult
    ? []
    : await p.db.any(query, queryParams);

  return {
    total: Number(countQueryData.count),
    data: queryData,
  };
}
