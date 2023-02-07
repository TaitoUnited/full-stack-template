import Boom from '@hapi/boom';
import { Context } from 'koa';
import { Service } from 'typedi';

import { memoizeAsync } from '../../common/utils/cache';
import { EntityType, Operation } from '../../common/types/entity';
import { getObjectKeysAsFieldNames } from '../../common/utils/format';
import { Pagination, FilterGroup, Order } from '../../common/types/search';

import {
  validateFilterGroups,
  validateFieldName,
  validatePagination,
} from '../../common/utils/validate';

import {
  User,
  UserFilter,
  RegisterUserInput,
  UpdateUserInput,
  DeleteUserInput,
} from '../types/user';

import { UserDao } from '../daos/UserDao';
import { AuthService } from './AuthService';

const filterableFieldNames = getObjectKeysAsFieldNames(new UserFilter());

@Service()
export class UserService {
  constructor(private authService: AuthService, private userDao: UserDao) {}

  public async search(input: {
    state: Context['state'];
    filterGroups: FilterGroup<UserFilter>[];
    order: Order;
    search?: string;
    pagination?: Pagination;
  }) {
    validateFilterGroups(input.filterGroups, filterableFieldNames);
    validateFieldName(input.order.field, filterableFieldNames);
    validatePagination(input.pagination, true);

    this.authService.checkPermission({
      state: input.state,
      entityType: EntityType.USER,
      operation: Operation.LIST,
    });

    // Add additional filters
    // NOTE: Add additional filters according to user permissions
    const filterGroups = input.filterGroups;
    // filterGroups = addFilter({
    //   filterGroups,
    //   field: 'someFilter',
    //   value: someFilter,
    // });

    return this.userDao.search({
      db: input.state.tx,
      search: input.search,
      filterGroups,
      order: input.order,
      pagination: input.pagination,
    });
  }

  public read = memoizeAsync<User>(this.readImpl, this);

  private async readImpl(state: Context['state'], id: string) {
    const user = await this.userDao.read(state.tx, id);
    if (!user) {
      throw Boom.notFound(`User not found with id ${id}`);
    }

    this.authService.checkPermission({
      state,
      entityType: EntityType.USER,
      operation: Operation.READ,
    });

    return user;
  }

  public async create(state: Context['state'], input: RegisterUserInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.USER,
      operation: Operation.CREATE,
    });

    return this.userDao.create(state.tx, input);
  }

  public async update(state: Context['state'], input: UpdateUserInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.USER,
      operation: Operation.UPDATE,
    });

    return this.userDao.update(state.tx, input);
  }

  public async delete(state: Context['state'], input: DeleteUserInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.USER,
      operation: Operation.DELETE,
    });

    const user = await this.read(state, input.id);
    await this.userDao.delete(state.tx, input);
    return user;
  }
}
