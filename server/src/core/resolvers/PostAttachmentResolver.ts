import { Context } from 'koa';
import Container, { Service } from 'typedi';
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Resolver,
  FieldResolver,
  Query,
  Root,
} from 'type-graphql';

import { Order, OrderDirection } from '../../common/types/search';
import {
  Attachment,
  AttachmentType,
  PaginatedAttachments,
  AttachmentUploadRequestDetails,
} from '../types/attachment';
import {
  ReadPostAttachmentInput,
  CreatePostAttachmentInput,
  FinalizePostAttachmentInput,
  UpdatePostAttachmentInput,
  DeletePostAttachmentInput,
} from '../types/postAttachment';
import { Post } from '../types/post';

import { PostAttachmentService } from '../services/PostAttachmentService';

/**
 * GraphQL resolver for Post Attachments
 */
@Service()
@Resolver(() => Post)
class PostAttachmentResolver {
  constructor(
    private readonly postAttachmentService = Container.get(
      PostAttachmentService
    )
  ) {}

  @Authorized()
  @Query(() => [String], {
    description: 'Returns all MIME types allowed for post attachments.',
  })
  async allowedPostAttachmentMimeTypes() {
    return this.postAttachmentService.getAllowedMimeTypes();
  }

  @Authorized()
  @Query(() => Attachment, {
    description: 'Reads a post attachment.',
  })
  async postAttachment(
    @Ctx() ctx: Context,
    @Arg('input') input: ReadPostAttachmentInput
  ) {
    return await this.postAttachmentService.read(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => AttachmentUploadRequestDetails, {
    description: `
      Creates a new attachment for post.
      Returns URL and HTTP headers that should be used to upload the file using HTTP PUT.
    `,
  })
  async createPostAttachment(
    @Ctx() ctx: Context,
    @Arg('input') input: CreatePostAttachmentInput
  ) {
    return await this.postAttachmentService.create(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => Attachment, {
    description:
      'Finalizes uploaded post attachment. Call this after successful HTTP PUT upload.',
  })
  async finalizePostAttachment(
    @Ctx() ctx: Context,
    @Arg('input') input: FinalizePostAttachmentInput
  ) {
    return await this.postAttachmentService.finalize(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => Attachment, {
    description: 'Updates post attachment.',
  })
  async updatePostAttachment(
    @Ctx() ctx: Context,
    @Arg('input') input: UpdatePostAttachmentInput
  ) {
    return await this.postAttachmentService.update(ctx.state, input);
  }

  @Authorized()
  @Mutation(() => Attachment, {
    description:
      'Deletes post attachment. Returns attachment that was deleted.',
  })
  async deletePostAttachment(
    @Ctx() ctx: Context,
    @Arg('input') input: DeletePostAttachmentInput
  ) {
    return await this.postAttachmentService.delete(ctx.state, input);
  }

  // ------------------------------------------------------
  // Field resolvers
  // ------------------------------------------------------

  @Authorized()
  @FieldResolver(() => PaginatedAttachments)
  async attachments(
    @Ctx() ctx: Context,
    @Root() root: Post,
    @Arg('attachmentOrder', () => Order, {
      defaultValue: new Order('createdAt', OrderDirection.ASC),
      nullable: true,
    })
    order: Order
  ) {
    return await this.postAttachmentService.list(
      ctx.state,
      root.id,
      AttachmentType.ATTACHMENT,
      order
    );
  }
}
