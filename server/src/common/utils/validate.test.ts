import 'reflect-metadata';
import {
  FilterGroup,
  Filter,
  FilterOperator,
  FilterLogicalOperator,
  ValueType,
} from '../types/search';
import { validateFilterGroups, validateColumnName } from './validate';

export class MyType {
  id: string;
  creationDate: Date;
  title: string;
  keywords: string[];
  notesCol: string;
}

describe('common/utils/db', () => {
  describe('#validateColumnName', () => {
    it('works ok', async () => {
      validateColumnName('col_name', ['col_name', 'title']);
      validateColumnName('colName', ['title', 'col_name']);

      expect(() => validateColumnName('column', ['title', 'col_name'])).toThrow(
        "Invalid column name: 'column'"
      );
    });
  });

  describe('#validateFilterGroups', () => {
    it('works ok', async () => {
      const filters1: Filter<MyType>[] = [
        new Filter<MyType>(
          MyType,
          'title',
          FilterOperator.EQ,
          'titlevalue',
          ValueType.TEXT
        ),
        new Filter<MyType>(
          MyType,
          'notesCol',
          FilterOperator.ILIKE,
          'notesvalue',
          ValueType.TEXT
        ),
      ];

      const filters2: Filter<MyType>[] = [
        new Filter<MyType>(
          MyType,
          'title',
          FilterOperator.GT,
          'titlevalue',
          ValueType.TEXT
        ),
        new Filter<MyType>(
          MyType,
          'notesCol',
          FilterOperator.NEQ,
          'notesvalue',
          ValueType.TEXT
        ),
      ];

      const filterGroups: FilterGroup<MyType>[] = [
        new FilterGroup<MyType>(MyType, FilterLogicalOperator.OR, filters1),
        new FilterGroup<MyType>(MyType, FilterLogicalOperator.AND, filters2),
      ];

      validateFilterGroups(filterGroups, ['title', 'notes_col']);

      expect(() =>
        validateFilterGroups(filterGroups, ['desc', 'notes'])
      ).toThrow('Invalid filter fields: notesCol, title');
    });
  });
});
