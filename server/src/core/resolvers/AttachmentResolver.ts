import { Context } from 'koa';
import Container, { Service } from 'typedi';
import { Authorized, Ctx, Resolver, FieldResolver, Root } from 'type-graphql';

import { Attachment } from '../types/attachment';
import { AttachmentService } from '../services/AttachmentService';

/**
 * GraphQL resolver for Attachments
 */
@Service()
@Resolver(() => Attachment)
class AttachmentResolver {
  constructor(
    private readonly attachmentService = Container.get(AttachmentService)
  ) {}

  @Authorized()
  @FieldResolver(() => String, { nullable: true })
  async fileUrl(@Ctx() ctx: Context, @Root() root: Attachment) {
    return this.attachmentService.getDownloadUrl(ctx.state, root);
  }
}
