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
import { formatFieldName } from './format';

function isSet(value?: any) {
  return value !== null && value !== undefined;
}

/**
 * Throws validation error if value is set.
 *
 * @param name
 * @param value
 */
export function validateNotSet(name: string, value?: any) {
  if (isSet(value)) {
    throw Boom.badRequest(`Value for ${name} should not be set`);
  }
}

/**
 * Throws validation error if both values are set but not equal.
 *
 * @param str1
 * @param str2
 */
export function validateEqualIfBothSet(
  str1?: string | null,
  str2?: string | null
) {
  if (isSet(str1) && isSet(str2) && str1 !== str2) {
    throw Boom.badRequest(`Values not equal: '${str1}' '${str2}'`);
  }
}

/**
 * Throws validation error if the given fieldName is not among the
 * allowedFieldNames.
 *
 * @param fieldName
 * @param allowedFieldNames
 */
export function validateFieldName(
  fieldName: string,
  allowedFieldNames: string[]
) {
  const convertedName = formatFieldName(fieldName);
  if (allowedFieldNames.indexOf(convertedName) === -1) {
    throw Boom.badRequest(`Invalid field name: '${fieldName}'`);
  }
}

/**
 * Throws validation error if fieldName of some ot the given filters
 * is not among the allowedFieldNames.
 *
 * @param filterGroups
 * @param allowedFieldNames
 */
export function validateFilterGroups(
  filterGroups: FilterGroup<any>[], // TODO: should be FilterGroup<Record<string, any>>[],
  allowedFieldNames: string[]
) {
  const invalids = new Set();

  filterGroups
    .map((group) => group.filters)
    .flat()
    .forEach((f) => {
      const convertedName = formatFieldName(String(f.field));

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

/**
 * Returns the given filter groups with one filter added as a new
 * filter group.
 *
 * @param origFilterGroups
 * @param itemType
 * @param field
 * @param value
 * @param filterOperator
 * @param valueType
 * @returns
 */
export function addFilter<Item extends Record<string, any>>(
  origFilterGroups: FilterGroup<any>[],
  itemType: ClassType<Item>,
  field: string,
  value: string,
  filterOperator: FilterOperator = FilterOperator.EQ,
  valueType: ValueType = ValueType.TEXT,
  filterLogicalOperator: FilterLogicalOperator = FilterLogicalOperator.AND,
  additionalFilters: Filter<Item>[] = []
) {
  const filter = new Filter<Item>(
    itemType,
    field,
    filterOperator,
    value as Item[keyof Item],
    valueType
  );

  const filterGroups: FilterGroup<Item>[] = [
    new FilterGroup<Item>(
      itemType,
      filterLogicalOperator,
      [filter].concat(additionalFilters)
    ),
  ];

  return filterGroups.concat(origFilterGroups);
}

/**
 * Returns the given filter groups with given filters added as a new
 * filter group.
 *
 * @param origFilterGroups
 * @param itemType
 * @param filterLogicalOperator
 * @param filters
 * @returns
 */
export function addFilters<Item extends Record<string, any>>(
  origFilterGroups: FilterGroup<any>[],
  itemType: ClassType<Item>,
  filterLogicalOperator: FilterLogicalOperator = FilterLogicalOperator.AND,
  filters: Filter<Item>[] = []
) {
  const filterGroups: FilterGroup<Item>[] = [
    new FilterGroup<Item>(itemType, filterLogicalOperator, filters),
  ];

  return filterGroups.concat(origFilterGroups);
}

/**
 * Throws validation error if the given pagination limit exceeds
 * the allowed limit.
 *
 * @param pagination
 * @param allowNull
 * @param limit
 * @returns
 */
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
