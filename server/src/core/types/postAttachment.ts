import { Field, InputType } from 'type-graphql';
import { AttachmentType, CreateAttachmentInputBase } from './attachment';

export class ReadPostAttachmentInput {
  id: string;
  postId: string;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}

@InputType()
export class CreatePostAttachmentInput extends CreateAttachmentInputBase {
  @Field() postId: string;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}

@InputType()
export class FinalizePostAttachmentInput {
  @Field() id: string;
  @Field() postId: string;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}

@InputType()
export class DeletePostAttachmentInput {
  @Field() id: string;
  @Field() postId: string;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}
