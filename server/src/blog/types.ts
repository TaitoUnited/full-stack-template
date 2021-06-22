import { Field, InputType, ObjectType } from 'type-graphql';
import { Paginated } from '../common/schema/search';

@ObjectType()
export class Post {
  @Field() id?: string;
  @Field() createdAt?: Date;
  @Field() updatedAt?: Date;
  @Field() subject?: string;
  @Field() content?: string;
  @Field() author?: string;
}

@ObjectType()
export class PaginatedPosts extends Paginated(Post) {}

@InputType()
export class CreatePostInput {
  @Field() subject: string;
  @Field() content: string;
  @Field() author: string;
}

@InputType()
export class UpdatePostInput {
  @Field() id: string;
  @Field(() => String, { nullable: true }) subject?: String | null;
  @Field(() => String, { nullable: true }) content?: String | null;
  @Field(() => String, { nullable: true }) author?: String | null;
}

@InputType()
export class DeletePostInput {
  @Field() id: string;
}

export const createPostExample: CreatePostInput = {
  subject: 'subject',
  content: 'content',
  author: 'author',
};

export const postExample: Post = {
  id: '1234',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...createPostExample,
};
