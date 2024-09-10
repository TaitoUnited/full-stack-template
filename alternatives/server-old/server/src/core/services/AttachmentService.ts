import Boom from '@hapi/boom';
import { Context } from 'koa';
import { Service } from 'typedi';
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import getStoragesById from '../../common/setup/storage';
import { checkSystemPermission } from '../../common/utils/auth';
import { getObjectKeysAsFieldNames } from '../../common/utils/format';
import {
  validateFilterGroups,
  validateFieldName,
  validatePagination,
} from '../../common/utils/validate';
import { RequestDetails } from '../../common/types/misc';
import { Pagination, FilterGroup, Order } from '../../common/types/search';
import {
  AttachmentId,
  AttachmentIdAndType,
  AttachmentUploadRequestDetails,
  AttachmentFilter,
  CreateAttachmentInput,
  UpdateAttachmentInput,
} from '../types/attachment';
import { AttachmentDao } from '../daos/AttachmentDao';

const filterableFieldNames = getObjectKeysAsFieldNames(new AttachmentFilter());

/**
 * Common service for handling all kinds of attachments
 */
@Service()
export class AttachmentService {
  constructor(private attachmentDao: AttachmentDao) {}

  public async search(input: {
    state: Context['state'];
    search: string | null;
    filterGroups: FilterGroup<AttachmentFilter>[];
    order: Order;
    pagination?: Pagination;
  }) {
    checkSystemPermission(input.state);

    validateFilterGroups(input.filterGroups, filterableFieldNames);
    validateFieldName(input.order.field, filterableFieldNames);
    validatePagination(input.pagination, true);

    return this.attachmentDao.search({
      db: input.state.tx,
      search: input.search,
      filterGroups: input.filterGroups,
      order: input.order,
      pagination: input.pagination,
    });
  }

  public async read(state: Context['state'], attachment: AttachmentId) {
    checkSystemPermission(state);
    return await this.attachmentDao.read(state.tx, attachment);
  }

  public async create(
    state: Context['state'],
    input: CreateAttachmentInput
  ): Promise<AttachmentUploadRequestDetails> {
    checkSystemPermission(state);

    // Validate content type
    this.validateContentType(input.contentType);

    // Add the attachment in database
    const newAttachment = await this.attachmentDao.create(state.tx, input);

    // Create signed upload url
    const uploadDetails = await this.getFileUploadDetails({
      state: state,
      path: this.getAttachmentPath(newAttachment),
      contentType: input.contentType,
      contentDisposition: `attachment; filename="${input.filename}"`,
      allowOnlyImages: false,
    });

    return {
      id: newAttachment.id,
      ...uploadDetails,
    };
  }

  public async finalize(state: Context['state'], input: AttachmentId) {
    // Check user permissions have been previously checked
    checkSystemPermission(state);

    // Finalize attachment in database
    return await this.attachmentDao.finalize(state.tx, input);
  }

  public async update(state: Context['state'], input: UpdateAttachmentInput) {
    checkSystemPermission(state);

    // Update attachment
    return this.attachmentDao.update(state.tx, input);
  }

  public async delete(state: Context['state'], input: AttachmentId) {
    // Check user permissions have been previously checked
    checkSystemPermission(state);

    // Delete attachment from database
    const deletedAttachment = await this.attachmentDao.delete(state.tx, input);

    // Attachment not found
    if (!deletedAttachment) {
      throw Boom.notFound(`Article not found with id ${input.id}`);
    }

    // Delete the file from S3
    const storagesById = await getStoragesById();
    const { bucketName, s3 } = storagesById.bucket;
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: this.getAttachmentPath(deletedAttachment),
      })
    );

    return deletedAttachment;
  }

  /**
   * Returns signed URL that can be used to download the file.
   */
  public async getDownloadUrl(
    state: Context['state'],
    input: AttachmentIdAndType
  ) {
    checkSystemPermission(state);

    const path = this.getAttachmentPath(input);

    // Use signed storage bucket url
    const storagesById = await getStoragesById();
    const { bucket } = storagesById;
    return await getSignedUrl(
      bucket.s3signer,
      new GetObjectCommand({
        Bucket: bucket.bucketName,
        Key: path,
      }),
      { expiresIn: 30 * 60 }
    );
  }

  /**
   * Returns signed URL and HTTP headers to be used to
   * upload the file using HTTP PUT.
   *
   * @param state
   * @param path
   * @param contentType
   * @param contentDisposition
   * @param allowOnlyImages
   * @returns
   */
  private async getFileUploadDetails({
    state,
    path,
    contentType,
    contentDisposition,
    allowOnlyImages,
  }: {
    state: Context['state'];
    path: string;
    contentType: string;
    contentDisposition: string;
    allowOnlyImages: boolean;
  }): Promise<RequestDetails> {
    checkSystemPermission(state);

    // Validate content type
    this.validateContentType(contentType, allowOnlyImages);

    // Create signed upload url
    const storagesById = await getStoragesById();
    const { bucket } = storagesById;
    const url = await getSignedUrl(
      bucket.s3signer,
      new PutObjectCommand({
        Bucket: bucket.bucketName,
        Key: path,
        ContentType: contentType,
        ContentDisposition: contentDisposition,
      }),
      {
        expiresIn: 30 * 60,
      }
    );

    return {
      url,
      headers: [
        {
          key: 'Content-Type',
          value: contentType,
        },
        {
          key: 'Content-Disposition',
          value: contentDisposition,
        },
      ],
    };
  }

  public getAllowedMimeTypes(allowOnlyImages = false) {
    return allowOnlyImages
      ? ['image/*']
      : [
          'image/*',
          'text/*',
          'application/pdf',
          // Excel (and OpenXML)
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          // Powerpoint (and OpenXML)
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ];
  }

  private validateContentType(contentType: string, allowOnlyImages = false) {
    const genericContentType = contentType
      .replace(/image\/.*/, 'image/*')
      .replace(/text\/.*/, 'text/*');

    if (
      !this.getAllowedMimeTypes(allowOnlyImages).includes(genericContentType)
    ) {
      throw Boom.badRequest(`Content type not supported: ${contentType}`);
    }
  }

  private getAttachmentPathPrefix(attachment: Omit<AttachmentIdAndType, 'id'>) {
    const typeFolder = `${attachment.attachmentType.toString().toLowerCase()}s`;
    if (attachment.postId) {
      return `posts/${attachment.postId}/${typeFolder}/`;
    }
    throw new Error('Unknown attachment type');
  }

  private getAttachmentPath(attachment: AttachmentIdAndType) {
    return this.getAttachmentPathPrefix(attachment) + attachment.id;
  }
}
