import { Context } from 'koa';
import { Service } from 'typedi';
import {
  addFilter,
  validateFilterGroups,
  validateFieldName,
} from '../../common/utils/validate';
import { keysAsSnakeCaseArray } from '../../common/utils/format';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import {
  EntityNameFilter,
  CreateEntityNameInput,
  UpdateEntityNameInput,
  DeleteEntityNameInput,
  entityNameFilterExample,
} from '../types/entityName';
import { EntityNameDao } from '../daos/EntityNameDao';
import { EntityType, Operation } from '../types/core';
import { CoreCoreAuthService } from './CoreCoreAuthService';

const filterableFieldNames = Object.getOwnPropertyNames(
  entityNameFilterExample
);

@Service()
export class EntityNameService {
  constructor(
    private coreCoreAuthService: CoreCoreAuthService,
    private entityNameDao: EntityNameDao
  ) {}

  public async search(
    state: Context['state'],
    search: string | null,
    origFilterGroups: FilterGroup<EntityNameFilter>[],
    order: Order,
    pagination: Pagination | null
  ) {
    validateFilterGroups(origFilterGroups, filterableFieldNames);
    validateFieldName(order.field, filterableFieldNames);

    // Check permissions
    await this.coreCoreAuthService.checkPermission(
      state,
      EntityType.ENTITY_NAME,
      Operation.LIST
    );

    // NOTE: Add additional filters according to user permissions

    // Add additional filters
    const filterGroups = origFilterGroups;
    // const filterGroups = addFilter(
    //   origFilterGroups,
    //   EntityNameFilter,
    //   'someFilter',
    //   someFilter
    // );

    return this.entityNameDao.search(
      state.tx,
      search,
      filterGroups,
      order,
      pagination
    );
  }

  public async read(state: Context['state'], id: string) {
    const entityName = await this.entityNameDao.read(state.tx, id);

    if (entityName) {
      // Check permissions
      await this.coreCoreAuthService.checkPermission(
        state,
        EntityType.ENTITY_NAME,
        Operation.VIEW,
        entityName.id
      );
    }

    return entityName;
  }

  public async create(
    state: Context['state'],
    entityName: CreateEntityNameInput
  ) {
    // Check permissions
    await this.coreCoreAuthService.checkPermission(
      state,
      EntityType.ENTITY_NAME,
      Operation.ADD
    );

    return this.entityNameDao.create(state.tx, entityName);
  }

  public async update(
    state: Context['state'],
    entityName: UpdateEntityNameInput
  ) {
    // Check permissions
    await this.coreCoreAuthService.checkPermission(
      state,
      EntityType.ENTITY_NAME,
      Operation.EDIT,
      entityName.id
    );

    return this.entityNameDao.update(state.tx, entityName);
  }

  public async delete(
    state: Context['state'],
    entityName: DeleteEntityNameInput
  ) {
    // Check permissions
    await this.coreCoreAuthService.checkPermission(
      state,
      EntityType.ENTITY_NAME,
      Operation.DELETE,
      entityName.id
    );

    return this.entityNameDao.delete(state.tx, entityName);
  }
}
