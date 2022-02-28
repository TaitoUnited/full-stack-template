import { Service } from 'typedi';
import { Db } from '../../common/types/context';
import {
  searchFromTable,
  getColumnNames,
  getParameterNames,
  getParameterAssignments,
  getParameterValues,
} from '../../common/utils/dao';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import { EntityId } from '../../common/types/entity';
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
  // Fields that can be updated
  subject: 'subject',
  content: 'content',
  author: 'author',
};

type DbOutput = DbInput & {
  // Read-only fields
  id: 'id';
  createdAt: Date;
  updatedAt: Date;
};
export const selectFields: Required<DbOutput> = {
  id: 'id',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...updateFields,
};

// Table and columns
const tableName = 'post';
const selectColumnNames = getColumnNames(selectFields, false, tableName);
const filterableColumnNames = getColumnNames(new PostFilter(), true);
const insertColumnNames = getColumnNames(updateFields);
const insertParameterNames = getParameterNames(updateFields);

// SELECT_COLUMNS_FRAGMENT EXAMPLE:
//
// `
//   CASE
//     WHEN geom is null then null
//     ELSE json_build_object('latitude', ST_Y(geom), 'longitude', ST_X(geom))
//   END AS coordinates,
// `
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
  public async search(
    db: Db,
    search: string | null,
    filterGroups: FilterGroup<PostFilter>[],
    order: Order,
    pagination: Pagination | null
  ): Promise<PaginatedPosts> {
    return searchFromTable({
      tableName,
      db,
      search,
      filterGroups,
      order,
      pagination,
      selectColumnNames,
      filterableColumnNames,

      // Custom fragments
      selectColumnsFragment: SELECT_COLUMNS_FRAGMENT,
      joinFragment: JOIN_FRAGMENT,
      whereFragment: WHERE_FRAGMENT,
      searchFragment: SEARCH_FRAGMENT,
      groupByFragment: GROUP_BY_FRAGMENT,

      // Prefetch optimization (not supported yet)
      // WARNING: Do not prefetch entities that user is not allowed to see!
      // prefetchReferences: [{ name: 'assignedUser', userColumnNames }],
    });
  }

  public async read(db: Db, id: string): Promise<Post | null> {
    return await db.oneOrNone(
      `
        SELECT
          ${SELECT_COLUMNS_FRAGMENT}
          ${selectColumnNames.join(',')}
        FROM ${tableName}
        WHERE id = $[id]
      `,
      {
        id,
      }
    );
  }

  public async create(db: Db, post: CreatePostInput): Promise<Post> {
    return await db.one(
      `
        INSERT INTO ${tableName}
          (${insertColumnNames.join(',')})
        VALUES (${insertParameterNames.join(',')})
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues({
        allowedKeys: updateFields,
        values: post,
      })
    );
  }

  public async update(db: Db, post: UpdatePostInput): Promise<Post> {
    const parameterAssignments = getParameterAssignments({
      allowedKeys: updateFields,
      values: post,
    });
    return await db.one(
      `
        UPDATE ${tableName}
        SET ${parameterAssignments.join(',')}
        WHERE id = $[id]
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: post.id,
        ...getParameterValues({
          allowedKeys: updateFields,
          values: post,
        }),
      }
    );
  }

  public async delete(db: Db, post: DeletePostInput): Promise<EntityId> {
    await db.none(
      `
        DELETE FROM ${tableName}
        WHERE id = $[id]
      `,
      {
        id: post.id,
      }
    );
    return post;
  }
}
