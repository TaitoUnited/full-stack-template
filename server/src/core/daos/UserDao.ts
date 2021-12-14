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
import { EntityId } from '../types/core';
import {
  User,
  UserFilter,
  PaginatedUsers,
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  userExample,
  createUserExample,
} from '../types/user';

const tableName = 'app_user';
const selectColumnNames = getColumnNames(userExample);
const filterableColumnNames = selectColumnNames;
const insertColumnNames = getColumnNames(createUserExample);
const insertParameterNames = getParameterNames(createUserExample);

@Service()
export class UserDao {
  public async search(
    db: Db,
    search: string | null,
    filterGroups: FilterGroup<UserFilter>[],
    order: Order,
    pagination: Pagination | null
  ): Promise<PaginatedUsers> {
    const searchFragment = search
      ? `
        AND (
          email ILIKE concat('%', $[search], '%')
          OR first_name ILIKE concat('%', $[search], '%')
          OR last_name ILIKE concat('%', $[search], '%')
        )
      `
      : '';

    return searchFromTable({
      tableName,
      db,
      search,
      filterGroups,
      order,
      pagination,
      whereFragment: `WHERE ${tableName}.status != 'deleted'`,
      searchFragment,
      selectColumnNames,
      filterableColumnNames,
    });
  }

  public async read(db: Db, id: string): Promise<User | null> {
    return await db.oneOrNone(
      `
        SELECT ${selectColumnNames.join(',')} FROM ${tableName}
        WHERE id = $[id]
        AND ${tableName}.status != 'deleted'
      `,
      {
        id,
      }
    );
  }

  public async readByExternalUserId(
    db: Db,
    externalUserId: string
  ): Promise<User | null> {
    return await db.oneOrNone(
      `
        SELECT ${selectColumnNames.join(',')} FROM ${tableName}
        WHERE external_ids @> $[externalIds]
        AND ${tableName}.status != 'deleted'
      `,
      {
        externalIds: [externalUserId],
      }
    );
  }

  public async readByEmail(db: Db, email: string): Promise<User | null> {
    return db.oneOrNone(
      `
      SELECT ${selectColumnNames.join(',')} FROM ${tableName}
      WHERE email = $[email]
      AND ${tableName}.status != 'deleted'`,
      {
        email,
      }
    );
  }

  public async create(db: Db, user: CreateUserInput): Promise<User> {
    return await db.one(
      `
        INSERT INTO ${tableName} (${insertColumnNames.join(',')}, status)
        VALUES (${insertParameterNames.join(',')}, 'created')
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues({
        allowedKeys: createUserExample,
        values: user,
      })
    );
  }

  public async update(db: Db, user: UpdateUserInput): Promise<User> {
    const parameterAssignments = getParameterAssignments({
      allowedKeys: createUserExample,
      values: user,
    });

    return await db.one(
      `
        UPDATE ${tableName}
        SET ${parameterAssignments.join(',')}
        WHERE id = $[id]
        AND ${tableName}.status != 'deleted'
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: user.id,
        ...getParameterValues({
          allowedKeys: createUserExample,
          values: user,
        }),
      }
    );
  }

  public async delete(db: Db, user: DeleteUserInput): Promise<EntityId> {
    await db.none(
      `
        UPDATE ${tableName}
        SET status = 'deleted'
        WHERE id = $[id]
      `,
      {
        id: user.id,
      }
    );
    return user;
  }
}
