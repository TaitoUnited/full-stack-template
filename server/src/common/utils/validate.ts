import Boom from '@hapi/boom';
import { ClassType } from 'type-graphql';
import {
  Filter,
  FilterGroup,
  FilterOperator,
  FilterLogicalOperator,
  Pagination,
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

export function validateFieldName(
  fieldName: string,
  allowedFieldNames: string[],
  convertDepth = true
) {
  // converts entityName.column to entityName_column
  const convertedName = convertDepth
    ? fieldName.replace(/\./g, '_')
    : fieldName;
  if (allowedFieldNames.indexOf(convertedName) === -1) {
    throw Boom.badRequest(`Invalid field name: '${fieldName}'`);
  }
}

export function validateFilterGroups(
  filterGroups: FilterGroup<any>[], // TODO: should be FilterGroup<Record<string, any>>[],
  allowedFieldNames: string[],
  convertDepth = true
) {
  const invalids = new Set();

  filterGroups
    .map((group) => group.filters)
    .flat()
    .forEach((f) => {
      // converts entityName.column to entityName_column
      const convertedName = convertDepth
        ? String(f.field).replace(/\./g, '_')
        : String(f.field);

      if (allowedFieldNames.indexOf(convertedName) === -1) {
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

export function validatePagination(
  pagination: Pagination | null,
  allowNull = false,
  limit = 1000
) {
  if (!pagination && allowNull) return;

  if (!pagination && !allowNull) {
    throw Boom.badRequest('Pagination not set.');
    return;
  }

  if (pagination && pagination?.limit > limit) {
    throw Boom.badRequest(
      `The given pagination limit (${pagination?.limit}) exceeds allowed limit (${limit}).`
    );
  }
}
