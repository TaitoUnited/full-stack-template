import { Field, InputType } from 'type-graphql';
import {
  AttachmentType,
  CreateAttachmentInput,
  UpdateAttachmentInput,
} from './attachment';

@InputType()
export class ReadPostAttachmentInput {
  @Field() id: string;
  @Field() postId: string;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}

@InputType()
export class CreatePostAttachmentInput extends CreateAttachmentInput {
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
export class UpdatePostAttachmentInput extends UpdateAttachmentInput {
  @Field() postId: string;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}

@InputType()
export class DeletePostAttachmentInput {
  @Field() id: string;
  @Field() postId: string;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}
