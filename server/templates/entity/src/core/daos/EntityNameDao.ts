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
import { EntityId } from '../../common/types/entity';
import {
  EntityName,
  EntityNameFilter,
  PaginatedEntityNames,
  CreateEntityNameInput,
  UpdateEntityNameInput,
  DeleteEntityNameInput,
} from '../types/entityName';

// Types: dbInput, dbOutput

type dbInput = CreateEntityNameInput & UpdateEntityNameInput;
export const updateFields: Required<Omit<dbInput, 'id'>> = {
  // Fields that can be updated
  // TEMPLATE_GENERATE: Update entity field examples
};

type dbOutput = dbInput & {
  // Read-only fields
  id: 'id';
  createdAt: Date;
  updatedAt: Date;
};
export const selectFields: Required<dbOutput> = {
  id: 'id',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...updateFields,
};

// Table and columns
const tableName = 'entity_name';
const selectColumnNames = getColumnNames(selectFields, false, tableName);
const filterableColumnNames = getColumnNames(new EntityNameFilter(), true);
const insertColumnNames = getColumnNames(updateFields);
const insertParameterNames = getParameterNames(updateFields);

// SELECT_COLUMNS_FRAGMENT EXAMPLE:
//
// `
//   CASE
//     WHEN geom is null then null
//     ELSE json_build_object('latitude', ST_Y(geom), 'longitude', ST_X(geom))
//   END AS coordinates,
// `
const SELECT_COLUMNS_FRAGMENT = '';

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
//     ${tableName}.name ILIKE concat('%', $[search], '%')
//     OR ${tableName}.description ILIKE concat('%', $[search], '%')
//   )
// `;
const SEARCH_FRAGMENT = 'AND 1 = 0';

// GROUP_BY_FRAGMENT EXAMPLE:
// `
//   GROUP BY ${selectColumnNames.join(',')}
// `;
const GROUP_BY_FRAGMENT = ``;

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
      selectColumnsFragment: SELECT_COLUMNS_FRAGMENT,
      joinFragment: JOIN_FRAGMENT,
      whereFragment: WHERE_FRAGMENT,
      searchFragment: SEARCH_FRAGMENT,
      groupByFragment: GROUP_BY_FRAGMENT,

      // Prefetch optimization (not supported yet)
      // WARNING: Do not prefetch entities that user is not allowed to see!
      // prefetchReferences: [{ name: 'assignedUser', userColumnNames }],
    });
  }

  public async read(db: Db, id: string): Promise<EntityName | null> {
    return await db.oneOrNone(
      `
        SELECT
          ${SELECT_COLUMNS_FRAGMENT}
          ${selectColumnNames.join(',')}
        FROM ${tableName}
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
        INSERT INTO ${tableName}
          (${insertColumnNames.join(',')})
        VALUES (${insertParameterNames.join(',')})
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues({
        allowedKeys: updateFields,
        values: entityName,
      })
    );
  }

  public async update(
    db: Db,
    entityName: UpdateEntityNameInput
  ): Promise<EntityName> {
    const parameterAssignments = getParameterAssignments({
      allowedKeys: updateFields,
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
          allowedKeys: updateFields,
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
