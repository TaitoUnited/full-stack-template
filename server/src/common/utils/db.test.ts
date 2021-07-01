// import { Db } from '../types/context';
import 'reflect-metadata';
import { trimGaps } from '../utils/format';
import {
  Pagination,
  Order,
  OrderDirection,
  FilterGroup,
  Filter,
  FilterType,
  FilterOperator,
  ValueType,
} from '../types/search';
import {
  getColumnNames,
  getParameterAssignments,
  getParameterValues,
  searchFromTable,
} from './db';

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

const selectColumnNames = getColumnNames(exampleObject);

const expectedResult = {
  total: 1,
  data: [{ id: 'test' }],
};

describe('dao/utils.ts', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    db.one.mockReturnValue({ count: `${expectedResult.total}` });
    db.any.mockReturnValue(expectedResult.data);
  });

  describe('#getParameterAssignments', () => {
    it('assigns subset of parameters', async () => {
      const assignments = getParameterAssignments(exampleObject, {
        title: 'titlevalue',
      });
      const values = getParameterValues(exampleObject, {
        title: 'titlevalue',
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
      const assignments = getParameterAssignments(exampleObject, exampleObject);
      const values = getParameterValues(exampleObject, exampleObject);
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
      const result = await searchFromTable(
        'my_table',
        db,
        null,
        [],
        new Order(OrderDirection.ASC, 'title'),
        new Pagination(0, 10),
        '',
        selectColumnNames
      );

      expect(result).toEqual(expectedResult);

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(id) FROM my_table
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
          SELECT id, creation_date, title, keywords, notes FROM my_table
          WHERE 1 = 1
          ORDER BY \"title\" ASC, \"my_table\".\"id\"
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

    it('search fragment works', async () => {
      const searchString = 'Searching for something';
      const searchFragment = `
        AND (
          title ILIKE concat('%', $[search], '%')
          OR notes ILIKE concat('%', $[search], '%')
        )
      `;

      const result = await searchFromTable(
        'my_table',
        db,
        searchString,
        [],
        new Order(OrderDirection.ASC, 'title'),
        new Pagination(0, 10),
        searchFragment,
        selectColumnNames
      );

      expect(result).toEqual(expectedResult);

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(id) FROM my_table
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
          SELECT id, creation_date, title, keywords, notes FROM my_table
          WHERE 1 = 1
          ${searchFragment}
          ORDER BY \"title\" ASC, \"my_table\".\"id\"
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
      await searchFromTable(
        'my_table',
        db,
        null,
        [],
        new Order(OrderDirection.DESC, 'notes'),
        new Pagination(50, 1200),
        '',
        selectColumnNames
      );

      expect(trimGaps(db.any.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT id, creation_date, title, keywords, notes FROM my_table
          WHERE 1 = 1
          ORDER BY \"notes\" DESC, \"my_table\".\"id\"
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
          MyType,
          FilterType.EQ,
          'title',
          'titlevalue',
          ValueType.TEXT
        ),
        new Filter<MyType>(
          MyType,
          FilterType.ILIKE,
          'notes',
          'notesvalue',
          ValueType.TEXT
        ),
      ];

      const filters2: Filter<MyType>[] = [
        new Filter<MyType>(
          MyType,
          FilterType.GT,
          'title',
          'titlevalue',
          ValueType.TEXT
        ),
        new Filter<MyType>(
          MyType,
          FilterType.NEQ,
          'notes',
          'notesvalue',
          ValueType.TEXT
        ),
      ];

      const filterGroups: FilterGroup<MyType>[] = [
        new FilterGroup<MyType>(MyType, FilterOperator.OR, filters1),
        new FilterGroup<MyType>(MyType, FilterOperator.AND, filters2),
      ];

      const result = await searchFromTable(
        'my_table',
        db,
        null,
        filterGroups,
        new Order(OrderDirection.ASC, 'title'),
        new Pagination(0, 10),
        '',
        selectColumnNames
      );

      expect(result).toEqual(expectedResult);

      const expectedFilterFragment = `
        AND (
          \"my_table\".\"title\"::TEXT = 'titlevalue'
          OR \"my_table\".\"notes\"::TEXT ILIKE concat('%', 'notesvalue', '%')
        )
        AND (
          \"my_table\".\"title\"::TEXT > 'titlevalue'
          AND \"my_table\".\"notes\"::TEXT != 'notesvalue'
        )
      `;

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(id) FROM my_table
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
          SELECT id, creation_date, title, keywords, notes FROM my_table
          WHERE 1 = 1
          ${expectedFilterFragment}
          ORDER BY \"title\" ASC, \"my_table\".\"id\"
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

    it('filter groups do not contain sql injection', async () => {
      const filters1: Filter<MyType>[] = [
        new Filter<MyType>(
          MyType,
          FilterType.EQ,
          'title',
          "' DELETE * FROM my_table",
          ValueType.TEXT
        ),
        new Filter<MyType>(
          MyType,
          FilterType.ILIKE,
          'notes',
          "' DELETE * FROM my_table",
          ValueType.TEXT
        ),
      ];

      const filterGroups: FilterGroup<MyType>[] = [
        new FilterGroup<MyType>(MyType, FilterOperator.OR, filters1),
      ];

      const result = await searchFromTable(
        'my_table',
        db,
        null,
        filterGroups,
        new Order(OrderDirection.ASC, 'title'),
        new Pagination(0, 10),
        '',
        selectColumnNames
      );

      expect(result).toEqual(expectedResult);

      const expectedFilterFragment = `
        AND (
          \"my_table\".\"title\"::TEXT = ''' DELETE * FROM my_table'
          OR \"my_table\".\"notes\"::TEXT ILIKE concat('%', ''' DELETE * FROM my_table', '%')
        )
      `;

      // Check count query
      expect(trimGaps(db.one.mock.calls[0][0])).toEqual(
        trimGaps(
          `
          SELECT count(id) FROM my_table
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
          SELECT id, creation_date, title, keywords, notes FROM my_table
          WHERE 1 = 1
          ${expectedFilterFragment}
          ORDER BY \"title\" ASC, \"my_table\".\"id\"
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
