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

import { EntityNameDao } from '../daos/EntityNameDao';
import { AuthService } from './AuthService';

const filterableFieldNames = getObjectKeysAsFieldNames(new EntityNameFilter());

@Service()
export class EntityNameService {
  constructor(
    private authService: AuthService,
    private entityNameDao: EntityNameDao
  ) {}

  public async search(
    state: Context['state'],
    search: string | null,
    origFilterGroups: FilterGroup<EntityNameFilter>[],
    order: Order,
    pagination?: Pagination
  ) {
    validateFilterGroups(origFilterGroups, filterableFieldNames);
    validateFieldName(order.field, filterableFieldNames);
    validatePagination(pagination, true);

    // Check permissions
    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.LIST,
    });

    // NOTE: Add additional filters according to user permissions

    // Add additional filters
    const filterGroups = origFilterGroups;

    // filterGroups = addFilter({
    //   filterGroups,
    //   field: 'someFilter',
    //   value: someFilter,
    // });

    return this.entityNameDao.search(
      state.tx,
      search,
      filterGroups,
      order,
      pagination
    );
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
      operation: Operation.VIEW,
      entityId: entityName.id,
    });

    return entityName;
  }

  public async create(state: Context['state'], input: CreateEntityNameInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.ADD,
    });

    return this.entityNameDao.create(state.tx, input);
  }

  public async update(state: Context['state'], input: UpdateEntityNameInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.EDIT,
      entityId: input.id,
    });

    return this.entityNameDao.update(state.tx, input);
  }

  public async delete(state: Context['state'], input: DeleteEntityNameInput) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.ENTITY_NAME,
      operation: Operation.DELETE,
      entityId: input.id,
    });

    const entityName = await this.read(state, input.id);
    await this.entityNameDao.delete(state.tx, input);
    return entityName;
  }
}
