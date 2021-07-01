import { Service } from 'typedi';
import { Db } from '../../common/types/context';
import {
  searchFromTable,
  getColumnNames,
  getParameterNames,
  getParameterAssignments,
  getParameterValues,
} from '../../common/utils/db';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import {
  Post,
  PaginatedPosts,
  CreatePostInput,
  UpdatePostInput,
  DeletePostInput,
  postExample,
  createPostExample,
} from '../types/post';

const tableName = 'post';
const selectColumnNames = getColumnNames(postExample);
const filterableColumnNames = selectColumnNames;
const insertColumnNames = getColumnNames(createPostExample);
const insertParameterNames = getParameterNames(createPostExample);

@Service()
export class PostDao {
  public async search(
    db: Db,
    search: string | null,
    filterGroups: FilterGroup<Post>[],
    order: Order,
    pagination: Pagination
  ): Promise<PaginatedPosts> {
    const searchFragment = search
      ? `
        AND (
          subject ILIKE concat('%', $[search], '%')
          OR content ILIKE concat('%', $[search], '%')
          OR author ILIKE concat('%', $[search], '%')
        )
      `
      : '';

    return searchFromTable(
      tableName,
      db,
      search,
      filterGroups,
      order,
      pagination,
      searchFragment,
      selectColumnNames,
      filterableColumnNames
    );
  }

  public async read(db: Db, id: string): Promise<Post | null> {
    return await db.oneOrNone(
      `
        SELECT ${selectColumnNames.join(',')} FROM ${tableName}
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
        INSERT INTO ${tableName} (${insertColumnNames.join(',')})
        VALUES (${insertParameterNames.join(',')})
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues(createPostExample, post)
    );
  }

  public async update(db: Db, post: UpdatePostInput): Promise<Post> {
    const parameterAssignments = getParameterAssignments(
      createPostExample,
      post
    );
    return await db.one(
      `
        UPDATE ${tableName}
        SET ${parameterAssignments.join(',')}
        WHERE id = $[id]
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: post.id,
        ...getParameterValues(createPostExample, post),
      }
    );
  }

  public async delete(db: Db, post: DeletePostInput): Promise<string> {
    await db.one(
      `
        DELETE FROM ${tableName}
        WHERE id = $[id]
      `,
      {
        id: post.id,
      }
    );
    return post.id;
  }
}
