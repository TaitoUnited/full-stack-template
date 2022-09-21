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
    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.READ,
    });

    let filterGroups = addFilter({ field: 'postId', value: postId });

    filterGroups = addFilter({
      filterGroups,
      field: 'attachmentType',
      value: attachmentType,
    });

    return await this.attachmentService.search({
      state,
      search: null,
      filterGroups,
      order,
    });
  }

  public read = memoizeAsync<Attachment>(this.readImpl, this);

  private async readImpl(
    state: Context['state'],
    input: ReadPostAttachmentInput
  ) {
    const attachment = await this.attachmentService.read(state, input);
    if (!attachment) {
      throw Boom.notFound(
        `Attachment not found with '${JSON.stringify(input)}'`
      );
    }

    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.READ,
    });

    return attachment;
  }

  public async create(
    state: Context['state'],
    input: CreatePostAttachmentInput
  ) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.UPDATE,
    });

    return this.attachmentService.create(state, input);
  }

  public async finalize(
    state: Context['state'],
    input: FinalizePostAttachmentInput
  ) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.UPDATE,
    });

    await this.attachmentService.finalize(state, input);
    return await this.read(state, input);
  }

  public async update(
    state: Context['state'],
    input: UpdatePostAttachmentInput
  ) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.UPDATE,
    });

    return this.attachmentService.update(state, input);
  }

  public async delete(
    state: Context['state'],
    input: DeletePostAttachmentInput
  ) {
    this.authService.checkPermission({
      state,
      entityType: EntityType.POST,
      operation: Operation.UPDATE,
    });

    const attachment = await this.read(state, input.id);
    await this.attachmentService.delete(state, input);
    return attachment;
  }
}
