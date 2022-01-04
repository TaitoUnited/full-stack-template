import Boom from '@hapi/boom';
import { ClassType } from 'type-graphql';
import {
  Filter,
  FilterGroup,
  FilterOperator,
  FilterLogicalOperator,
  ValueType,
} from '../types/search';
import { toSnakeCase } from './format';

export function validateNotSet(name: string, value?: any) {
  if (value) {
    throw Boom.badRequest(`Value for ${name} should not be set`);
  }
}

export function validateEqualIfBothSet(
  str1?: string | null,
  str2?: string | null
) {
  if (str1 && str2 && str1 !== str2) {
    throw Boom.badRequest(`Values not equal: '${str1}' '${str2}'`);
  }
}

export function validateColumnName(
  columnName: string,
  allowedColumnNames: string[]
) {
  if (allowedColumnNames.indexOf(toSnakeCase(columnName)) === -1) {
    throw Boom.badRequest(`Invalid column name: '${columnName}'`);
  }
}

export function validateFilterGroups(
  filterGroups: FilterGroup<any>[], // TODO: should be FilterGroup<Record<string, any>>[],
  allowedColumnNames: string[]
) {
  const invalids = new Set();

  filterGroups
    .map((group) => group.filters)
    .flat()
    .forEach((f) => {
      if (allowedColumnNames.indexOf(toSnakeCase(String(f.field))) === -1) {
        invalids.add(String(f.field));
      }
    });

  if (invalids.size > 0) {
    throw Boom.badRequest(
      `Invalid filter fields: ${Array.from(invalids).sort().join(', ')}`
    );
  }
}

export function addFilter<Item extends Record<string, any>>(
  origFilterGroups: FilterGroup<any>[],
  itemType: ClassType<Item>,
  field: string,
  value: string,
  filterOperator: FilterOperator = FilterOperator.EQ,
  valueType: ValueType = ValueType.TEXT
) {
  const filter = new Filter<Item>(
    itemType,
    field,
    filterOperator,
    value as Item[keyof Item],
    valueType
  );

  const filterGroups: FilterGroup<Item>[] = [
    new FilterGroup<Item>(itemType, FilterLogicalOperator.AND, [filter]),
  ];

  return filterGroups.concat(origFilterGroups);
}
