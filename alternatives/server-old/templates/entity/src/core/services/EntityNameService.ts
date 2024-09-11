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
  EntityName,
  EntityNameFilter,
  CreateEntityNameInput,
  UpdateEntityNameInput,
  DeleteEntityNameInput,
} from '../types/entityName';

import { AuthService } from './AuthService';
import { EntityNameDao } from '../daos/EntityNameDao';

const filterableFieldNames = getObjectKeysAsFieldNames(new EntityNameFilter());

@Service()
export class EntityNameService {
  constructor(
    private authService: AuthService,
    private entityNameDao: EntityNameDao
  ) {}

  public async search(input: {
    state: Context['state'];
    search: string | null;
    filterGroups: FilterGroup<EntityNameFilter>[];
    order: Order;
    pagination?: Pagination;
  }) {
    validateFilterGroups(input.filterGroups, filterableFieldNames);
    validateFieldName(input.order.field, filterableFieldNames);
    validatePagination(input.pagination, true);

    this.authService.checkPermission({
      state: input.state,
      entityType: EntityType.ENTITY_NAME,
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

    return this.entityNameDao.search({
      db: input.state.tx,
      search: input.search,
      filterGroups,
      order: input.order,
      pagination: input.pagination,
    });
  }

  public read = memoizeAsync<EntityName>(this.readImpl, this);

  private async readImpl(state: Context['state'], id: string) {
    const entityName = await this.entityNameDao.read(state.tx, id);
    if (!entityName) {
      throw Boom.notFound(`EntityName not found with id ${id}`);
    }

    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.READ,
      // Additional details for permission check:
      // account: entityName.accountId
    });

    return entityName;
  }

  public async create(state: Context['state'], input: CreateEntityNameInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.CREATE,
      // Additional details for permission check:
      // account: input.accountId
    });

    return this.entityNameDao.create(state.tx, input);
  }

  public async update(state: Context['state'], input: UpdateEntityNameInput) {
    const entityName = await this.read(state, input.id);

    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.UPDATE,
      // Additional details for permission check:
      // account: entityName.accountId
    });

    return this.entityNameDao.update(state.tx, input);
  }

  public async delete(state: Context['state'], input: DeleteEntityNameInput) {
    const entityName = await this.read(state, input.id);

    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.DELETE,
      // Additional details for permission check:
      // account: entityName.accountId
    });

    return this.entityNameDao.delete(state.tx, input);
  }
}
