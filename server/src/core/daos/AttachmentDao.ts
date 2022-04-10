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
const customSelectColumnNames: string[] = [];
const selectColumnNames = getColumnNames(
  selectFields,
  false,
  tableName,
  customSelectColumnNames
);
const filterableColumnNames = getColumnNames(new AttachmentFilter(), true);
const insertColumnNames = getColumnNames(updateFields);
const insertParameterNames = getParameterNames(updateFields);

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
  public async search(
    db: Db,
    search: string | null,
    filterGroups: FilterGroup<AttachmentFilter>[],
    order: Order,
    pagination: Pagination | null
  ): Promise<PaginatedAttachments> {
    return searchFromTable({
      db,
      search,
      filterGroups,
      order,
      pagination,

      tableName,
      selectColumnNames,
      customSelectColumnNames,
      filterableColumnNames,

      // Custom fragments
      debugSql: false,
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

  public async read(
    db: Db,
    attachmentId: AttachmentId
  ): Promise<Attachment | null> {
    const referenceFragment = this.getEntityReferenceFragment(attachmentId);
    const referenceParams = this.getEntityReferenceParams(attachmentId);

    return await db.oneOrNone(
      `
        SELECT
          ${SELECT_COLUMNS_FRAGMENT}
          ${selectColumnNames.join(',')}
        FROM ${tableName}
        ${WHERE_FRAGMENT}
        AND id = $[id]
        ${referenceFragment}
      `,
      {
        id: attachmentId.id,
        ...referenceParams,
      }
    );
  }

  public async create(
    db: Db,
    attachment: CreateAttachmentInputInternal
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
        values: attachment,
      })
    );
  }

  public async finalize(
    db: Db,
    attachmentId: AttachmentId
  ): Promise<Attachment> {
    const referenceFragment = this.getEntityReferenceFragment(attachmentId);
    const referenceParams = this.getEntityReferenceParams(attachmentId);

    return await db.one(
      `
        UPDATE ${tableName}
        SET lifecycle_status = 'CREATED'
        WHERE id = $[id]
        ${referenceFragment}
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: attachmentId.id,
        ...referenceParams,
      }
    );
  }

  public async update(
    db: Db,
    attachment: UpdateAttachmentInputInternal
  ): Promise<Attachment> {
    const referenceFragment = this.getEntityReferenceFragment(attachment);
    const referenceParams = this.getEntityReferenceParams(attachment);

    const parameterAssignments = getParameterAssignments({
      allowedKeys: updateFields,
      values: attachment,
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
        id: attachment.id,
        ...referenceParams,
        ...getParameterValues({
          allowedKeys: updateFields,
          values: attachment,
        }),
      }
    );
  }

  public async delete(
    db: Db,
    attachment: DeleteAttachmentInputInternal
  ): Promise<Attachment | null> {
    const referenceFragment = this.getEntityReferenceFragment(attachment);
    const referenceParams = this.getEntityReferenceParams(attachment);

    return await db.oneOrNone(
      `
        DELETE FROM ${tableName}
        WHERE id = $[id]
        ${referenceFragment}
        RETURNING ${selectColumnNames.join(',')}
      `,
      {
        id: attachment.id,
        ...referenceParams,
      }
    );
  }

  private getEntityReferenceFragment(id: AttachmentId) {
    if (id.postId) return 'AND post_id = $[postId]';
    throw Error('Unknown entity reference on attachment');
  }

  private getEntityReferenceParams(id: AttachmentId) {
    if (id.postId) return { postId: id.postId };
    throw Error('Unknown entity reference on attachment');
  }
}
