import { Context } from 'koa';
import { Service } from 'typedi';

import {
  validateFieldName,
  validateFilterGroups,
  validatePagination,
} from '../../common/utils/validate';

import {
  RegisterUserInput,
  UpdateUserInput,
  UserFilter,
  userSchema,
} from '../types/user';

import { FilterGroup, Order, Pagination } from '../../common/types/search';
import { UserDao } from '../daos/UserDao';

const filterableFieldNames = Object.getOwnPropertyNames(userSchema);

@Service()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  public async search(params: {
    state: Context['state'];
    filterGroups: FilterGroup<UserFilter>[];
    order: Order;
    search?: string;
    pagination?: Pagination;
  }) {
    validateFilterGroups(params.filterGroups, filterableFieldNames);
    validateFieldName(params.order.field, filterableFieldNames);
    validatePagination(params.pagination, true);

    return this.userDao.search({
      db: params.state.tx,
      search: params.search,
      filterGroups: params.filterGroups,
      order: params.order,
      pagination: params.pagination,
    });
  }

  public async read(state: Context['state'], id: string) {
    const user = await this.userDao.read(state.tx, id);
    return user;
  }

  public async create(state: Context['state'], user: RegisterUserInput) {
    return this.userDao.create(state.tx, user);
  }

  public async update(state: Context['state'], input: UpdateUserInput) {
    const user = await this.userDao.update(state.tx, input);
    return user;
  }

  public async delete(ctx: Context, id: string) {
    return this.userDao.delete(ctx.state.tx, id);
  }
}
