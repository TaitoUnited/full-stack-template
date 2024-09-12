import { Field, InputType, ObjectType, ID } from 'type-graphql';
import { RequestDetails } from '../../common/types/misc';
import { Paginated } from '../../common/types/search';

// --- Common ---

export enum AttachmentType {
  ATTACHMENT = 'ATTACHMENT',
  PHOTO = 'PHOTO',
}

export class AttachmentId {
  id: string;
  postId?: string | null;
}

export class AttachmentIdAndType extends AttachmentId {
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}

// --- Read ---

@ObjectType()
export class Attachment {
  @Field(() => ID) id: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => Date) updatedAt: Date;
  attachmentType: AttachmentType; // Not exposed on GraphQL API
  @Field(() => String) contentType: string;
  @Field(() => String, { nullable: true }) filename: string | null;
  @Field(() => String, { nullable: true }) title: string | null;
  @Field(() => String, { nullable: true }) description: string | null;

  // Entity references
  postId: string | null;
}

@ObjectType()
export class PaginatedAttachments extends Paginated(Attachment) {}

// --- Filter ----

@InputType()
export class AttachmentFilter {
  @Field() id?: string = undefined;
  @Field() createdAt?: Date = undefined;
  @Field() updatedAt?: Date = undefined;
  @Field() attachmentType?: AttachmentType = undefined;
  @Field() contentType?: string = undefined;
  @Field() filename?: string = undefined;
  @Field() title?: string = undefined;
  @Field() description?: string = undefined;

  // Entity references
  @Field() postId?: string = undefined;

  // EXAMPLE: Filter by column of a referenced entity
  // See also JOIN_FRAGMENT EXAMPLE on DAO. You must JOIN
  // user AS assigned_user.
  //
  // @Field() ref_assignedUser_username?: string = undefined;
}

// --- Create ---

@InputType()
export class CreateAttachmentInputBase {
  @Field(() => String) contentType: string;
  @Field(() => String, { nullable: true }) filename?: string | null;
  attachmentType: AttachmentType = AttachmentType.ATTACHMENT;
}

@InputType()
export class CreateAttachmentInput extends CreateAttachmentInputBase {
  @Field(() => String, { nullable: true }) title?: string | null;
  @Field(() => String, { nullable: true }) description?: string | null;
}

export class CreateAttachmentInputInternal extends CreateAttachmentInput {
  postId?: string | null;
}

// --- Update ---

@InputType()
export class UpdateAttachmentInputBase {
  @Field() id: string;
}

@InputType()
export class UpdateAttachmentInput extends UpdateAttachmentInputBase {
  @Field(() => String, { nullable: true }) title?: string | null;
  @Field(() => String, { nullable: true }) description?: string | null;
}

export class UpdateAttachmentInputInternal extends UpdateAttachmentInput {
  postId?: string | null;
}

// --- Delete ---

@InputType()
export class DeleteAttachmentInput {
  @Field() id: string;
}

export class DeleteAttachmentInputInternal extends DeleteAttachmentInput {
  postId?: string | null;
}

// --- Upload ---

@ObjectType()
export class AttachmentUploadRequestDetails extends RequestDetails {
  @Field(() => String) id: string;
}
