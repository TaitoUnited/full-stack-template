import 'reflect-metadata';

import {
  Pagination,
  Order,
  OrderDirection,
  FilterGroup,
  Filter,
  FilterOperator,
  FilterLogicalOperator,
  ValueType,
} from '../types/search';

import {
  getColumnNames,
  getParameterAssignments,
  getParameterValues,
  searchFromTable,
} from './dao';

import { trimGaps } from '../utils/format';

const db = {
  one: jest.fn(),
  any: jest.fn(),
};

export class MyType {
  id: string;
  creationDate: Date;
  title: string;
  keywords: string[];
  notes: string;
}

const exampleObject = {
  id: 'id',
  creationDate: new Date(),
  title: 'Example title',
  keywords: ['key1', 'key2'],
  notes: 'Some notes',
};

const selectColumnNames = getColumnNames({
  schema: exampleObject,
  tableName: 'my_table',
});

const expectedResult = {
  total: 1,
  data: [{ id: 'test' }],
};

describe('common/utils/db', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    db.one.mockReturnValue({ count: `${expectedResult.total}` });
    db.any.mockReturnValue(expectedResult.data);
  });

  describe('#getParameterAssignments', () => {
    it('assigns subset of parameters', async () => {
      const assignments = getParameterAssignments({
        allowedKeys: exampleObject,
        values: {
          title: 'titlevalue',
        },
      });
      const values = getParameterValues({
        allowedKeys: exampleObject,
        values: {
          title: 'titlevalue',
        },
      });
      expect(assignments.join(', ')).toEqual(trimGaps(`title = $[title]`));
      expect(values).toEqual({
        id: null,
        creation_date: null,
        title: 'titlevalue',
        keywords: null,
        notes: null,
      });
    });

    it('assigns all parameters', async () => {
      const assignments = getParameterAssignments({
        allowedKeys: exampleObject,
        values: exampleObject,
      });
      const values = getParameterValues({
        allowedKeys: exampleObject,
        values: exampleObject,
      });
      expect(assignments.join(', ')).toEqual(
        trimGaps(
          `
          id = $[id],
          creation_date = $[creation_date],
          title = $[title],
          keywords = $[keywords],
          notes = $[notes]
          `
        )
      );
      expect(values).toEqual({
        id: exampleObject.id,
        creation_date: exampleObject.creationDate,
        title: exampleObject.title,
        keywords: exampleObject.keywords,
        notes: exampleObject.notes,
      });
    });
  });

  describe('#searchFromTable', () => {
    it('basic query works', async () => {
      const result = await searchFromTable({
        tableName: 'my_table',
        db,
        search: null,
        filterGroups: [],
        order: new Order('title', OrderDirection.ASC),
        pagination: new Pagination(0, 10),
        searchFragment: '',
        selectColumnNames,
        filterableColumnNames: ['title'],
      });

      expect(result).toEqual(expectedResult);

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(DISTINCT my_table.id) FROM my_table
          WHERE 1 = 1
          `
        )
      );
      expect(db.one.mock.calls[0][1]).toEqual({
        search: undefined,
      });

      // Check data query
      expect(trimGaps(db.any.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT DISTINCT
            my_table.id, my_table.creation_date, my_table.title, my_table.keywords, my_table.notes FROM my_table
          WHERE 1 = 1
          ORDER BY "my_table"."title" ASC
          OFFSET $[offset] LIMIT $[limit]
          `
        )
      );
      expect(db.any.mock.calls[0][1]).toEqual({
        offset: 0,
        limit: 10,
        search: undefined,
      });
    });

    it('select columns fragment works', async () => {
      const selectColumnsFragment = `
        json_build_object('latitude', ST_Y(geom), 'longitude', ST_X(geom)) coordinates,
      `;

      const result = await searchFromTable({
        tableName: 'my_table',
        db,
        filterGroups: [],
        order: new Order('title', OrderDirection.ASC),
        pagination: new Pagination(0, 10),
        selectColumnsFragment,
        selectColumnNames,
        filterableColumnNames: ['title'],
      });

      expect(result).toEqual(expectedResult);

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(DISTINCT my_table.id) FROM my_table
          WHERE 1 = 1
          `
        )
      );
      expect(db.one.mock.calls[0][1]).toEqual({});

      // Check data query
      expect(trimGaps(db.any.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT DISTINCT
            ${selectColumnsFragment}
            my_table.id, my_table.creation_date, my_table.title, my_table.keywords, my_table.notes
          FROM my_table
          WHERE 1 = 1
          ORDER BY "my_table"."title" ASC
          OFFSET $[offset] LIMIT $[limit]
          `
        )
      );
      expect(db.any.mock.calls[0][1]).toEqual({
        offset: 0,
        limit: 10,
      });
    });

    it('search fragment works', async () => {
      const searchString = 'Searching for something';
      const searchFragment = `
        AND (
          title ILIKE concat('%', $[search], '%')
          OR notes ILIKE concat('%', $[search], '%')
        )
      `;

      const result = await searchFromTable({
        tableName: 'my_table',
        db,
        search: searchString,
        filterGroups: [],
        order: new Order('title', OrderDirection.ASC),
        pagination: new Pagination(0, 10),
        searchFragment,
        selectColumnNames,
        filterableColumnNames: ['title'],
      });

      expect(result).toEqual(expectedResult);

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(DISTINCT my_table.id) FROM my_table
          WHERE 1 = 1
          ${searchFragment}
          `
        )
      );
      expect(db.one.mock.calls[0][1]).toEqual({
        search: searchString,
      });

      // Check data query
      expect(trimGaps(db.any.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT DISTINCT
            my_table.id, my_table.creation_date, my_table.title, my_table.keywords, my_table.notes FROM my_table
          WHERE 1 = 1
          ${searchFragment}
          ORDER BY "my_table"."title" ASC
          OFFSET $[offset] LIMIT $[limit]
          `
        )
      );
      expect(db.any.mock.calls[0][1]).toEqual({
        offset: 0,
        limit: 10,
        search: searchString,
      });
    });

    it('ordering and pagination works', async () => {
      await searchFromTable({
        tableName: 'my_table',
        db,
        search: null,
        filterGroups: [],
        order: [
          new Order('notes', OrderDirection.DESC, true),
          new Order('title', OrderDirection.ASC),
        ],
        pagination: new Pagination(50, 1200),
        searchFragment: '',
        selectColumnNames,
        filterableColumnNames: ['notes', 'title'],
      });

      expect(trimGaps(db.any.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT DISTINCT
            my_table.id, my_table.creation_date, my_table.title, my_table.keywords, my_table.notes FROM my_table
          WHERE 1 = 1
          ORDER BY "my_table"."notes" DESC NULLS LAST, "my_table"."title" ASC
          OFFSET $[offset] LIMIT $[limit]
          `
        )
      );
      expect(db.any.mock.calls[0][1]).toEqual({
        offset: 50,
        limit: 1200,
        search: undefined,
      });
    });

    it('filter groups work', async () => {
      const filters1: Filter<MyType>[] = [
        new Filter<MyType>(
          'title',
          FilterOperator.EQ,
          'titlevalue',
          ValueType.TEXT
        ),
        new Filter<MyType>(
          'notes',
          FilterOperator.ILIKE,
          'notesvalue',
          ValueType.TEXT
        ),
      ];

      const filters2: Filter<MyType>[] = [
        new Filter<MyType>(
          'title',
          FilterOperator.GT,
          'titlevalue',
          ValueType.TEXT
        ),
        new Filter<MyType>(
          'notes',
          FilterOperator.NEQ,
          'notesvalue',
          ValueType.TEXT
        ),
      ];

      const filterGroups: FilterGroup<MyType>[] = [
        new FilterGroup<MyType>(FilterLogicalOperator.OR, filters1),
        new FilterGroup<MyType>(FilterLogicalOperator.AND, filters2),
      ];

      const result = await searchFromTable({
        tableName: 'my_table',
        db,
        search: null,
        filterGroups,
        order: new Order('title', OrderDirection.ASC),
        pagination: new Pagination(0, 10),
        searchFragment: '',
        selectColumnNames,
        filterableColumnNames: ['title', 'notes'],
      });

      expect(result).toEqual(expectedResult);

      const expectedFilterFragment = `
        AND (
          "my_table"."title"::TEXT = 'titlevalue'
          OR "my_table"."notes"::TEXT ILIKE concat('%', 'notesvalue', '%')
        )
        AND (
          "my_table"."title"::TEXT > 'titlevalue'
          AND "my_table"."notes"::TEXT != 'notesvalue'
        )
      `;

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(DISTINCT my_table.id) FROM my_table
          WHERE 1 = 1
          ${expectedFilterFragment}
          `
        )
      );
      expect(db.one.mock.calls[0][1]).toEqual({
        search: undefined,
        // title: 'titlevalue',
        // notes: 'notesvalue',
      });

      // Check data query
      expect(trimGaps(db.any.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT DISTINCT
            my_table.id, my_table.creation_date, my_table.title, my_table.keywords, my_table.notes FROM my_table
          WHERE 1 = 1
          ${expectedFilterFragment}
          ORDER BY "my_table"."title" ASC
          OFFSET $[offset] LIMIT $[limit]
          `
        )
      );
      expect(db.any.mock.calls[0][1]).toEqual({
        offset: 0,
        limit: 10,
        search: undefined,
        // title: 'titlevalue',
        // notes: 'notesvalue',
      });
    });

    it('only allowed columns can be filtered', async () => {
      const filters1: Filter<MyType>[] = [
        new Filter<MyType>(
          'title',
          FilterOperator.EQ,
          "' DELETE * FROM my_table",
          ValueType.TEXT
        ),
        new Filter<MyType>(
          'notes',
          FilterOperator.ILIKE,
          "' DELETE * FROM my_table",
          ValueType.TEXT
        ),
      ];

      const filterGroups: FilterGroup<MyType>[] = [
        new FilterGroup<MyType>(FilterLogicalOperator.OR, filters1),
      ];

      try {
        await searchFromTable({
          tableName: 'my_table',
          db,
          search: null,
          filterGroups,
          order: new Order('title', OrderDirection.ASC),
          pagination: new Pagination(0, 10),
          searchFragment: '',
          selectColumnNames,
          filterableColumnNames: ['title'],
        });
        expect(true).toEqual(false);
      } catch (err: any) {
        expect(err.message).toEqual(
          "Filtering with column 'notes' not allowed"
        );
      }
    });

    it('filter groups do not contain sql injection', async () => {
      const filters1: Filter<MyType>[] = [
        new Filter<MyType>(
          'title',
          FilterOperator.EQ,
          "' DELETE * FROM my_table",
          ValueType.TEXT
        ),
        new Filter<MyType>(
          'notes',
          FilterOperator.ILIKE,
          "' DELETE * FROM my_table",
          ValueType.TEXT
        ),
      ];

      const filterGroups: FilterGroup<MyType>[] = [
        new FilterGroup<MyType>(FilterLogicalOperator.OR, filters1),
      ];

      const result = await searchFromTable({
        tableName: 'my_table',
        db,
        search: null,
        filterGroups,
        order: new Order('title', OrderDirection.ASC),
        pagination: new Pagination(0, 10),
        searchFragment: '',
        selectColumnNames,
        filterableColumnNames: ['title', 'notes'],
      });

      expect(result).toEqual(expectedResult);

      const expectedFilterFragment = `
        AND (
          "my_table"."title"::TEXT = ''' DELETE * FROM my_table'
          OR "my_table"."notes"::TEXT ILIKE concat('%', ''' DELETE * FROM my_table', '%')
        )
      `;

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(DISTINCT my_table.id) FROM my_table
          WHERE 1 = 1
          ${expectedFilterFragment}
          `
        )
      );
      expect(db.one.mock.calls[0][1]).toEqual({
        search: undefined,
        // title: 'titlevalue',
        // notes: 'notesvalue',
      });

      // Check data query
      expect(trimGaps(db.any.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT DISTINCT
            my_table.id, my_table.creation_date, my_table.title, my_table.keywords, my_table.notes FROM my_table
          WHERE 1 = 1
          ${expectedFilterFragment}
          ORDER BY "my_table"."title" ASC
          OFFSET $[offset] LIMIT $[limit]
          `
        )
      );
      expect(db.any.mock.calls[0][1]).toEqual({
        offset: 0,
        limit: 10,
        search: undefined,
        // title: 'titlevalue',
        // notes: 'notesvalue',
      });
    });
  });
});
