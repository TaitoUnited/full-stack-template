import { Context } from 'koa';
import { Service } from 'typedi';

import {
  ReadPostAttachmentInput,
  CreatePostAttachmentInput,
  FinalizePostAttachmentInput,
  UpdatePostAttachmentInput,
  DeletePostAttachmentInput,
} from '../types/postAttachment';

import { addFilter } from '../../common/utils/validate';
import { Order } from '../../common/types/search';
import { AttachmentType } from '../types/attachment';
import { AttachmentService } from '../services/AttachmentService';
import { EntityType, Operation } from '../../common/types/entity';
import { AuthService } from '../services/AuthService';

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
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.VIEW,
      postId
    );

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
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.VIEW,
      input.postId
    );

    return await this.attachmentService.read(state, input);
  }

  public async create(
    state: Context['state'],
    attachment: CreatePostAttachmentInput
  ) {
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.EDIT,
      attachment.postId
    );

    return this.attachmentService.create(state, attachment);
  }

  public async finalize(
    state: Context['state'],
    attachment: FinalizePostAttachmentInput
  ) {
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.EDIT,
      attachment.postId
    );

    await this.attachmentService.finalize(state, attachment);
    return await this.read(state, attachment);
  }

  public async update(
    state: Context['state'],
    attachment: UpdatePostAttachmentInput
  ) {
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.EDIT,
      attachment.postId
    );

    return this.attachmentService.update(state, attachment);
  }

  public async delete(
    state: Context['state'],
    attachment: DeletePostAttachmentInput
  ) {
    // Check permissions
    await this.authService.checkPermission(
      state,
      EntityType.POST,
      Operation.EDIT,
      attachment.postId
    );

    // Delete attachment
    return await this.attachmentService.delete(state, attachment);
  }
}
