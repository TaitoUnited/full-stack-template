import Boom from '@hapi/boom';
import { Context } from 'koa';
import { Service } from 'typedi';

import { memoizeAsync } from '../../common/utils/cache';
import { EntityType, Operation } from '../../common/types/entity';
import { Order } from '../../common/types/search';
import { addFilter } from '../../common/utils/validate';

import { Attachment, AttachmentType } from '../types/attachment';
import {
  ReadPostAttachmentInput,
  CreatePostAttachmentInput,
  FinalizePostAttachmentInput,
  UpdatePostAttachmentInput,
  DeletePostAttachmentInput,
} from '../types/postAttachment';

import { AuthService } from '../services/AuthService';
import { AttachmentService } from '../services/AttachmentService';

@Service()
export class PostAttachmentService {
  constructor(
    private authService: AuthService,
    private attachmentService: AttachmentService
  ) {}

  public async getAllowedMimeTypes() {
    return this.attachmentService.getAllowedMimeTypes();
  }

  async list(
    state: Context['state'],
    postId: string,
    attachmentType: AttachmentType,
    order: Order
  ) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.VIEW,
      entityId: postId,
    });

    let filterGroups = addFilter({ field: 'postId', value: postId });

    filterGroups = addFilter({
      filterGroups,
      field: 'attachmentType',
      value: attachmentType,
    });

    return await this.attachmentService.search(
      state,
      null,
      filterGroups,
      order
    );
  }

  public async read(state: Context['state'], input: ReadPostAttachmentInput) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.VIEW,
      entityId: input.postId,
    });

    return await this.attachmentService.read(state, input);
  }

  public async create(
    state: Context['state'],
    attachment: CreatePostAttachmentInput
  ) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.EDIT,
      entityId: attachment.postId,
    });

    return this.attachmentService.create(state, attachment);
  }

  public async finalize(
    state: Context['state'],
    attachment: FinalizePostAttachmentInput
  ) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.EDIT,
      entityId: attachment.postId,
    });

    await this.attachmentService.finalize(state, attachment);
    return await this.read(state, attachment);
  }

  public async update(
    state: Context['state'],
    attachment: UpdatePostAttachmentInput
  ) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.EDIT,
      entityId: attachment.postId,
    });

    return this.attachmentService.update(state, attachment);
  }

  public async delete(
    state: Context['state'],
    attachment: DeletePostAttachmentInput
  ) {
    await this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.EDIT,
      entityId: attachment.postId,
    });

    return await this.attachmentService.delete(state, attachment);
  }
}
