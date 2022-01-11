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
  EntityName,
  EntityNameFilter,
  PaginatedEntityNames,
  CreateEntityNameInput,
  UpdateEntityNameInput,
  DeleteEntityNameInput,
  entityNameExample,
  entityNameFilterExample,
  createEntityNameExample,
  updateEntityNameExample,
} from '../types/entityName';

const tableName = 'entity_name';
const selectColumnNames = getColumnNames(entityNameExample, false, tableName);
const filterableColumnNames = getColumnNames(entityNameFilterExample, true);
const insertColumnNames = getColumnNames(createEntityNameExample);
const insertParameterNames = getParameterNames(createEntityNameExample);

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
//     name ILIKE concat('%', $[search], '%')
//     OR description ILIKE concat('%', $[search], '%')
//   )
// `;
const SEARCH_FRAGMENT = 'AND 1 = 0';

@Service()
export class EntityNameDao {
  public async search(
    db: Db,
    search: string | null,
    filterGroups: FilterGroup<EntityNameFilter>[],
    order: Order,
    pagination: Pagination | null
  ): Promise<PaginatedEntityNames> {
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
      joinFragment: JOIN_FRAGMENT,
      whereFragment: WHERE_FRAGMENT,
      searchFragment: SEARCH_FRAGMENT,

      // Prefetch optimization (not supported yet)
      // WARNING: Do not prefetch entities that user is not allowed to see!
      // prefetchReferences: [{ name: 'assignedUser', userExample }],
    });
  }

  public async read(db: Db, id: string): Promise<EntityName | null> {
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

  public async create(
    db: Db,
    entityName: CreateEntityNameInput
  ): Promise<EntityName> {
    return await db.one(
      `
        INSERT INTO ${tableName} (${insertColumnNames.join(',')})
        VALUES (${insertParameterNames.join(',')})
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues({
        allowedKeys: createEntityNameExample,
        values: entityName,
      })
    );
  }

  public async update(
    db: Db,
    entityName: UpdateEntityNameInput
  ): Promise<EntityName> {
    const parameterAssignments = getParameterAssignments({
      allowedKeys: updateEntityNameExample,
      values: entityName,
    });
    return await db.one(
      `
        UPDATE ${tableName}
        SET ${parameterAssignments.join(',')}
        WHERE id = $[id]
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: entityName.id,
        ...getParameterValues({
          allowedKeys: updateEntityNameExample,
          values: entityName,
        }),
      }
    );
  }

  public async delete(
    db: Db,
    entityName: DeleteEntityNameInput
  ): Promise<EntityId> {
    await db.none(
      `
        DELETE FROM ${tableName}
        WHERE id = $[id]
      `,
      {
        id: entityName.id,
      }
    );
    return entityName;
  }
}
