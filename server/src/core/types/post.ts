import { Field, InputType, ObjectType, Float, Int, ID } from 'type-graphql';
import { Paginated } from '../../common/types/search';

// Read

@ObjectType()
export class Post {
  @Field(() => ID) id: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => Date) updatedAt: Date;
  @Field(() => String) subject: string;
  @Field(() => String) content: string;
  @Field(() => String) author: string;
}

@ObjectType()
export class PaginatedPosts extends Paginated(Post) {}

export const postExample: Post = {
  id: 'id',
  createdAt: new Date(),
  updatedAt: new Date(),
  subject: 'subject',
  content: 'content',
  author: 'author',
};

// Filter

@InputType()
export class PostFilter {
  @Field() createdAt: Date;
  @Field() updatedAt: Date;

  // EXAMPLE: Filter by column of a referenced entity
  // See also JOIN_FRAGMENT EXAMPLE on DAO. You must JOIN
  // user AS assigned_user.
  //
  // @Field() assignedUser_username: string;
}

export const postFilterExample: PostFilter = {
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Create

@InputType()
export class CreatePostInput {
  @Field(() => String) subject: string;
  @Field(() => String) content: string;
  @Field(() => String) author: string;
}

export const createPostExample: CreatePostInput = {
  subject: 'subject',
  content: 'content',
  author: 'author',
};

// Update

@InputType()
export class UpdatePostInput {
  @Field() id: string;
  @Field(() => String, { nullable: true }) subject?: string;
  @Field(() => String, { nullable: true }) content?: string;
  @Field(() => String, { nullable: true }) author?: string;
}
export const updatePostExample: Omit<UpdatePostInput, 'id'> = {
  subject: 'subject',
  content: 'content',
  author: 'author',
};

// Delete

@InputType()
export class DeletePostInput {
  @Field() id: string;
}
