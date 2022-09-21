import bcrypt from 'bcrypt';
import { Service } from 'typedi';

import {
  getColumnNames,
  getParameterAssignments,
  getParameterNames,
  getParameterValues,
  searchFromTable,
} from '../../common/utils/dao';

import {
  User,
  UserFilter,
  PaginatedUsers,
  CreateUserInput,
  userSchema,
  userFilterSchema,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
  DeleteUserInput,
} from '../types/user';

import { Db } from '../../common/types/context';
import { FilterGroup, Order, Pagination } from '../../common/types/search';

const tableName = 'users';

const selectColumnNames = getColumnNames({
  schema: userSchema,
  tableName,
});
const filterableColumnNames = getColumnNames({
  schema: userFilterSchema,
  convertDepth: true,
});
const insertColumnNames = getColumnNames({
  schema: createUserSchema,
});
const insertParameterNames = getParameterNames({
  schema: createUserSchema,
});

@Service()
export class UserDao {
  public async search(params: {
    db: Db;
    filterGroups: FilterGroup<UserFilter>[];
    order: Order;
    search?: string;
    pagination?: Pagination;
  }): Promise<PaginatedUsers> {
    return searchFromTable({
      db: params.db,
      search: params.search,
      filterGroups: params.filterGroups,
      order: params.order,
      pagination: params.pagination,
      tableName,
      selectColumnNames,
      filterableColumnNames,
    });
  }

  public async create(db: Db, input: CreateUserInput): Promise<User> {
    const { password, ...rest } = input;
    const passHash = bcrypt.hashSync(password, 12);
    const values: typeof createUserSchema = { ...rest, passHash };

    return await db.one(
      `
        INSERT INTO ${tableName}
          (${insertColumnNames.join(',')})
        VALUES (${insertParameterNames.join(',')})
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues({ allowedKeys: createUserSchema, values })
    );
  }

  public async read(db: Db, id: string): Promise<User | null> {
    return await db.oneOrNone(
      `
        SELECT ${selectColumnNames.join(',')}
        FROM ${tableName}
        WHERE id = $[id]
      `,
      { id }
    );
  }

  public async update(db: Db, values: UpdateUserInput): Promise<User> {
    const parameterAssignments = getParameterAssignments({
      allowedKeys: updateUserSchema,
      values,
    });

    return db.one(
      `
        UPDATE ${tableName}
        SET ${parameterAssignments.join(',')}
        WHERE id = $[id]
        RETURNING ${selectColumnNames.join(',')}
        `,
      getParameterValues({ allowedKeys: updateUserSchema, values })
    );
  }

  public async delete(db: Db, input: DeleteUserInput): Promise<string> {
    await db.none(
      `
        DELETE FROM ${tableName}
        WHERE id = $[id]
      `,
      { id: input.id }
    );
    return input.id;
  }
}
