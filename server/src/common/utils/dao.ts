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

/**
 * Returns keys of an object as valid database table column names.
 *
 * @param object The object
 * @param convertDepth If true, _ is converted to . ('eName_cName' -> 'e_name.c_name')
 * @param tableName Table name to be added as column name prefix, or null.
 * @param excludeColumns Optional list of column names to be excluded.
 * @returns Each column as 'table_name.column_name'
 */
export const getColumnNames = (
  object: Record<string, any>,
  convertDepth = false,
  tableName: string | null = null,
  excludeColumns: string[] = []
): string[] => {
  return format
    .keysAsSnakeCaseArray(object, convertDepth)
    .filter((c) => !excludeColumns.includes(c))
    .map((c) => (tableName ? `${tableName}.${c}` : c));
};

const formatParameterNames = (columns: string[]) => {
  return columns.map((column) => `$[${toSnakeCase(column)}]`);
};

/**
 * Returns keys of an object as arameter names to be added for example
 * in an INSERT statement values section.
 *
 * @param object
 * @returns Each column as '$[column_name]'
 */
export const getParameterNames = (object: Record<string, any>): string[] => {
  return formatParameterNames(Object.getOwnPropertyNames(object));
};

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
 * @returns Assignments, for example ['id = $[id]', 'creation_date = $[creation_date]']
 */
export const getParameterAssignments = (p: {
  /**
   * Array or object that specifies the allowed fields in camelCase.
   */
  allowedKeys: any[] | Record<string, any>;
  /**
   * Field values to be updated.
   */
  values?: Record<string, any>;
}): string[] => {
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
  order: Order,
  filterableColumnNames: string[],
  table: string,
  fallbackField: string | null,
  disableTablePrefix = false
) {
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

  return pgp.as.format(
    `
    ORDER BY
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
  );
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
function createOrderColumnsFragment(
  order: Order,
  filterableColumnNames: string[],
  selectColumnNames: string[],
  table: string
) {
  const columnTable = getColumnTable(order.field, filterableColumnNames, table);
  const columnName = getColumnName(order.field, filterableColumnNames);
  const name = `${columnTable}.${columnName}`;

  return selectColumnNames.includes(name)
    ? ''
    : `, ${name} AS added_order_by_column`;
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
  order: Order,
  filterableColumnNames: string[],
  selectColumnNames: string[],
  table: string
) {
  const added = createOrderColumnsFragment(
    order,
    filterableColumnNames,
    selectColumnNames,
    table
  );
  return added ? ', added_order_by_column' : '';
}

export type searchFromTableParams = {
  /** Database table name */
  tableName: string;
  /** Database tool */
  db: any; // TODO: should be Db
  /** Freely written search text */
  search?: string | null;
  /** Filters */
  filterGroups: FilterGroup<any>[]; // TODO: should be FilterGroup<Record<string, any>>[],
  /** Order */
  order: Order;
  /** Pagination */
  pagination: Pagination | null;

  /** columns added to the select statement */
  selectColumnNames: string[];
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

  /** Does not use DISTINCT in select statement if true */
  disableDistinct?: boolean;
  /** Does not add order by column to select statement if true */
  disableOrderColumns?: boolean;
  /** Does not add table prefix on order by columns if true */
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
    p.tableName,
    p.disableOrderColumnFallback === true ? null : 'id',
    p.disableOrderColumnTablePrefix
  );
  const orderColumnsFragment = createOrderColumnsFragment(
    p.order,
    p.filterableColumnNames,
    p.selectColumnNames,
    p.tableName
  );
  const groupByColumnsFragment = createGroupByColumnsFragment(
    p.order,
    p.filterableColumnNames,
    p.selectColumnNames,
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
    ${p.unionsFragment || ''}
  `;

  const countQueryParams = {
    search: p.search || undefined,
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
      ${p.disableOrderColumns ? '' : orderColumnsFragment}
    FROM ${p.tableName}
    ${p.joinFragment || ''}
    ${whereFragment}
    ${searchFragment || ''}
    ${filterFragment || ''}
    ${p.unionsFragment || ''}
    ${p.groupByFragment || ''}
    ${p.groupByFragment ? groupByColumnsFragment : ''}
    ${orderFragment || ''}
    ${paginationFragment || ''}
  `;

  const queryParams = {
    ...p.pagination,
    search: p.search || undefined,
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
