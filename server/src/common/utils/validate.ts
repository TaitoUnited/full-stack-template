import Boom from '@hapi/boom';
import { toSnakeCase } from './format';
import { FilterGroup } from '../types/search';

export function validateColumnName(columnName: string, allowedNames: string[]) {
  if (allowedNames.indexOf(toSnakeCase(columnName)) === -1) {
    throw Boom.badRequest(`Invalid column name: '${columnName}'`);
  }
}

export function validateFilterGroups(
  filterGroups: FilterGroup<any>[], // TODO: should be FilterGroup<Record<string, any>>[],
  filterableColumnNames: string[]
) {
  const invalids = new Set();

  filterGroups
    .map((group) => group.filters)
    .flat()
    .forEach((f) => {
      if (filterableColumnNames.indexOf(toSnakeCase(String(f.field))) === -1) {
        invalids.add(String(f.field));
      }
    });

  if (invalids.size > 0) {
    throw Boom.badRequest(
      `Invalid filter fields: ${Array.from(invalids).sort().join(', ')}`
    );
  }
}
