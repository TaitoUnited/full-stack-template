import { Service } from 'typedi';

import {
  searchFromTable,
  getColumnNames,
  getParameterNames,
  getParameterAssignments,
  getParameterValues,
} from '../../common/utils/dao';

import { Db } from '../../common/types/context';
import { Pagination, FilterGroup, Order } from '../../common/types/search';

import {
  AttachmentId,
  Attachment,
  AttachmentFilter,
  AttachmentType,
  PaginatedAttachments,
  CreateAttachmentInputInternal,
  UpdateAttachmentInputInternal,
  DeleteAttachmentInputInternal,
} from '../types/attachment';

// Types: DbInput, DbOutput

type DbInput = CreateAttachmentInputInternal & UpdateAttachmentInputInternal;
export const updateFields: Required<Omit<DbInput, 'id'>> = {
  // Writable fields
  attachmentType: AttachmentType.ATTACHMENT,
  contentType: 'image/jpeg',
  filename: 'IMG-123.jpg',
  postId: '98164164-f5b7-417f-9d39-ec4fabed08a2',
  title: 'Cool photo',
  description: 'Cool photo taken on...',
};

type DbOutput = Attachment;
export const selectFields: Required<DbOutput> = {
  // Read-only fields
  id: 'id',
  createdAt: new Date(),
  updatedAt: new Date(),
  // Writable fields
  ...updateFields,
};

// Table and columns
const tableName = 'attachment';
const selectColumnNames = getColumnNames({ schema: selectFields, tableName });
const filterableColumnNames = getColumnNames({
  schema: new AttachmentFilter(),
  convertDepth: true,
});
const insertColumnNames = getColumnNames({ schema: updateFields });
const insertParameterNames = getParameterNames({ schema: updateFields });

// SELECT_COLUMNS_FRAGMENT EXAMPLE:
// `
//   CASE
//     WHEN geom is null then null
//     ELSE json_build_object('latitude', ST_Y(geom), 'longitude', ST_X(geom))
//   END AS base_coordinates,
// `
// Notes:
// - Add 'base_coordinates' also to customSelectColumnNames.
// - Add also GROUP_BY_FRAGMENT if you use aggregate functions here.
//
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
const WHERE_FRAGMENT = `WHERE ${tableName}.lifecycle_status != 'DELETED'`;

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
export class AttachmentDao {
  public async search(input: {
    db: Db;
    search: string | null;
    filterGroups: FilterGroup<AttachmentFilter>[];
    order: Order;
    pagination?: Pagination;
  }): Promise<PaginatedAttachments> {
    return searchFromTable({
      db: input.db,
      search: input.search,
      filterGroups: input.filterGroups,
      order: input.order,
      pagination: input.pagination,
      tableName,
      selectColumnNames,
      filterableColumnNames,
      // Custom fragments
      selectColumnsFragment: SELECT_COLUMNS_FRAGMENT,
      joinFragment: JOIN_FRAGMENT,
      whereFragment: WHERE_FRAGMENT,
      searchFragment: SEARCH_FRAGMENT,
      groupByFragment: GROUP_BY_FRAGMENT,
    });
  }

  public async read(db: Db, input: AttachmentId): Promise<Attachment | null> {
    const referenceFragment = this.getEntityReferenceFragment(input);
    const referenceParams = this.getEntityReferenceParams(input);

    return await db.oneOrNone(
      `
        SELECT DISTINCT
          ${SELECT_COLUMNS_FRAGMENT}
          ${selectColumnNames.join(',')}
        FROM ${tableName}
        ${WHERE_FRAGMENT}
        AND id = $[id]
        ${referenceFragment}
      `,
      {
        id: input.id,
        ...referenceParams,
      }
    );
  }

  public async create(
    db: Db,
    input: CreateAttachmentInputInternal
  ): Promise<Attachment> {
    return await db.one(
      `
        INSERT INTO ${tableName}
          (${insertColumnNames.join(',')}, lifecycle_status)
        VALUES (${insertParameterNames.join(',')}, 'DELETED')
        RETURNING ${selectColumnNames.join(',')}
      `,
      getParameterValues({
        allowedKeys: updateFields,
        values: input,
      })
    );
  }

  public async finalize(db: Db, input: AttachmentId): Promise<Attachment> {
    const referenceFragment = this.getEntityReferenceFragment(input);
    const referenceParams = this.getEntityReferenceParams(input);

    return await db.one(
      `
        UPDATE ${tableName}
        SET lifecycle_status = 'CREATED'
        WHERE id = $[id]
        ${referenceFragment}
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: input.id,
        ...referenceParams,
      }
    );
  }

  public async update(
    db: Db,
    input: UpdateAttachmentInputInternal
  ): Promise<Attachment> {
    const referenceFragment = this.getEntityReferenceFragment(input);
    const referenceParams = this.getEntityReferenceParams(input);

    const parameterAssignments = getParameterAssignments({
      allowedKeys: updateFields,
      values: input,
    });
    return await db.one(
      `
        UPDATE ${tableName}
        SET ${parameterAssignments.join(',')}
        WHERE id = $[id]
        ${referenceFragment}
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: input.id,
        ...referenceParams,
        ...getParameterValues({
          allowedKeys: updateFields,
          values: input,
        }),
      }
    );
  }

  public async delete(
    db: Db,
    input: DeleteAttachmentInputInternal
  ): Promise<Attachment | null> {
    const referenceFragment = this.getEntityReferenceFragment(input);
    const referenceParams = this.getEntityReferenceParams(input);

    return await db.oneOrNone(
      `
        DELETE FROM ${tableName}
        WHERE id = $[id]
        ${referenceFragment}
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: input.id,
        ...referenceParams,
      }
    );
  }

  private getEntityReferenceFragment(input: AttachmentId) {
    if (input.postId) return 'AND post_id = $[postId]';
    throw Error('Unknown entity reference on attachment');
  }

  private getEntityReferenceParams(input: AttachmentId) {
    if (input.postId) return { postId: input.postId };
    throw Error('Unknown entity reference on attachment');
  }
}
