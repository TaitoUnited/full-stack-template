import { Context } from 'koa';
import { Service } from 'typedi';
import Boom from '@hapi/boom';
import {
  validateFilterGroups,
  validateColumnName,
  validateNotSet,
} from '../../common/utils/validate';
import { keysAsSnakeCaseArray } from '../../common/utils/format';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import {
  UserFilter,
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  userFilterExample,
} from '../types/user';
import { UserDao } from '../daos/UserDao';
import { EntityType, Operation } from '../types/core';
import { CoreAuthService } from './CoreAuthService';

const filterableColumnNames = keysAsSnakeCaseArray(userFilterExample);

@Service()
export class UserService {
  constructor(
    private coreAuthService: CoreAuthService,
    private userDao: UserDao
  ) {}

  public async search(
    state: Context['state'],
    search: string | null,
    filterGroups: FilterGroup<UserFilter>[],
    order: Order,
    pagination: Pagination | null
  ) {
    // Validate input
    validateColumnName(order.field, filterableColumnNames);
    validateFilterGroups(filterGroups, filterableColumnNames);

    // Check permissions
    await this.coreAuthService.checkPermission(
      state,
      EntityType.USER,
      Operation.LIST
    );

    // Fetch from db
    return await this.userDao.search(
      state.tx,
      search,
      filterGroups,
      order,
      pagination
    );
  }

  public async read(state: Context['state'], id: string) {
    const user = await this.userDao.read(state.tx, id);

    if (user) {
      // Check permissions
      await this.coreAuthService.checkPermission(
        state,
        EntityType.USER,
        Operation.VIEW,
        user.id
      );
    }

    return user;
  }

  public async create(state: Context['state'], user: CreateUserInput) {
    throw Boom.forbidden('Forbidden, at least for now');
  }

  public async update(state: Context['state'], user: UpdateUserInput) {
    // Validate
    validateNotSet('email', user.email);
    validateNotSet('externalIds', user.externalIds);

    // Check permissions
    await this.coreAuthService.checkPermission(
      state,
      EntityType.USER,
      Operation.EDIT,
      user.id
    );

    return this.userDao.update(state.tx, user);
  }

  public async delete(state: Context['state'], user: DeleteUserInput) {
    await this.coreAuthService.checkPermission(
      state,
      EntityType.USER,
      Operation.DELETE,
      user.id
    );
    return this.userDao.delete(state.tx, user);
  }
}
