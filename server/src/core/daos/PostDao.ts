import { Service } from 'typedi';

import {
  searchFromTable,
  getColumnNames,
  getParameterNames,
  getParameterAssignments,
  getParameterValues,
} from '../../common/utils/dao';

import { Db } from '../../common/types/context';
import { Pagination, FilterGroup, Order } from '../../common/types/search';

import {
  Post,
  PostFilter,
  PaginatedPosts,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
} from '../types/post';

// Types: DbInput, DbOutput

type DbInput = CreatePostInput & UpdatePostInput;
export const updateFields: Required<Omit<DbInput, 'id'>> = {
  // Writable fields
  subject: 'subject',
  content: 'content',
  author: 'author',
};

type DbOutput = Post;
export const selectFields: Required<DbOutput> = {
  // Read-only fields
  id: 'id',
  createdAt: new Date(),
  updatedAt: new Date(),
  // Writable fields
  ...updateFields,
};

// Table and columns
const tableName = 'post';
const selectColumnNames = getColumnNames({ schema: selectFields, tableName });
const filterableColumnNames = getColumnNames({
  schema: new PostFilter(),
  convertDepth: true,
});
const insertColumnNames = getColumnNames({ schema: updateFields });
const insertParameterNames = getParameterNames({ schema: updateFields });

// SELECT_COLUMNS_FRAGMENT EXAMPLE:
// `
//   CASE
//     WHEN geom is null then null
//     ELSE json_build_object('latitude', ST_Y(geom), 'longitude', ST_X(geom))
//   END AS base_coordinates,
// `
// Notes:
// - Add 'base_coordinates' also to customSelectColumnNames.
// - Add also GROUP_BY_FRAGMENT if you use aggregate functions here.
//
const SELECT_COLUMNS_FRAGMENT = '';

// JOIN_FRAGMENT EXAMPLE:
// `
//   JOIN organization on (
//     ${tableName}.organization_id = organization.id
//   )
//   LEFT JOIN user AS assigned_user on (
//     ${tableName}.assigned_user_id = assigned_user.id
//   )
// `
const JOIN_FRAGMENT = '';

// WHERE_FRAGMENT EXAMPLE:
// `
//   WHERE ${tableName}.lifecycle_status != 'DELETED'
// `
const WHERE_FRAGMENT = 'WHERE 1 = 1';

// SEARCH_FRAGMENT EXAMPLE:
// `
//   AND (
//     ${tableName}.name ILIKE concat('%', $[search], '%')
//     OR ${tableName}.description ILIKE concat('%', $[search], '%')
//   )
// `;
const SEARCH_FRAGMENT = 'AND 1 = 0';

// GROUP_BY_FRAGMENT EXAMPLE:
// `
//   GROUP BY ${selectColumnNames.join(',')}
// `;
const GROUP_BY_FRAGMENT = ``;

@Service()
export class PostDao {
  public async search(input: {
    db: Db;
    search: string | null;
    filterGroups: FilterGroup<PostFilter>[];
    order: Order;
    pagination?: Pagination;
  }): Promise<PaginatedPosts> {
    return searchFromTable({
      db: input.db,
      search: input.search,
      filterGroups: input.filterGroups,
      order: input.order,
      pagination: input.pagination,
      tableName,
      selectColumnNames,
      filterableColumnNames,
      // Custom fragments
      selectColumnsFragment: SELECT_COLUMNS_FRAGMENT,
      joinFragment: JOIN_FRAGMENT,
      whereFragment: WHERE_FRAGMENT,
      searchFragment: SEARCH_FRAGMENT,
      groupByFragment: GROUP_BY_FRAGMENT,
    });
  }

  public async read(db: Db, id: string): Promise<Post | null> {
    return await db.oneOrNone(
      `
        SELECT DISTINCT
          ${SELECT_COLUMNS_FRAGMENT}
          ${selectColumnNames.join(',')}
        FROM ${tableName}
        WHERE ${tableName}.id = $[id]
      `,
      {
        id,
      }
    );
  }

  public async create(db: Db, input: CreatePostInput): Promise<Post> {
    return await db.one(
      `
        INSERT INTO ${tableName}
          (${insertColumnNames.join(',')})
        VALUES (${insertParameterNames.join(',')})
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues({
        allowedKeys: updateFields,
        values: input,
      })
    );
  }

  public async update(db: Db, input: UpdatePostInput): Promise<Post> {
    const parameterAssignments = getParameterAssignments({
      allowedKeys: updateFields,
      values: input,
    });
    return await db.one(
      `
        UPDATE ${tableName}
        SET ${parameterAssignments.join(',')}
        WHERE ${tableName}.id = $[id]
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: input.id,
        ...getParameterValues({
          allowedKeys: updateFields,
          values: input,
        }),
      }
    );
  }

  public async delete(db: Db, input: DeletePostInput): Promise<Post> {
    return await db.one(
      `
        DELETE FROM ${tableName}
        WHERE ${tableName}.id = $[id]
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: input.id,
      }
    );
  }
}
