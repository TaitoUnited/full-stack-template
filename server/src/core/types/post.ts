import { Field, InputType, ObjectType } from 'type-graphql';
import { Paginated } from '../../common/types/search';

@ObjectType()
export class Post {
  @Field() id: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field(() => String, { nullable: true }) subject: string | null;
  @Field(() => String, { nullable: true }) content: string | null;
  @Field(() => String, { nullable: true }) author: string | null;
  @Field(() => String, { nullable: true }) moderatorId: string | null;
}

@InputType()
export class PostFilter {
  @Field() subject?: string;
  @Field() author?: string;
}

@ObjectType()
export class PaginatedPosts extends Paginated(Post) {}

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true }) subject?: string | null;
  @Field(() => String, { nullable: true }) content?: string | null;
  @Field(() => String, { nullable: true }) author?: string | null;
  @Field(() => String, { nullable: true }) moderatorId?: string | null;
}

@InputType()
export class UpdatePostInput {
  @Field() id: string;
  @Field(() => String, { nullable: true }) subject?: string | null;
  @Field(() => String, { nullable: true }) content?: string | null;
  @Field(() => String, { nullable: true }) author?: string | null;
  @Field(() => String, { nullable: true }) moderatorId?: string | null;
}

@InputType()
export class DeletePostInput {
  @Field() id: string;
}

export const createPostExample: CreatePostInput = {
  subject: 'subject',
  content: 'content',
  author: 'author',
  moderatorId: 'b575409e-aade-48ef-b06b-737564c9e462',
};

export const postExample: Post = {
  id: '1234',
  createdAt: new Date(),
  updatedAt: new Date(),
  subject: 'subject',
  content: 'content',
  author: 'author',
  moderatorId: 'b575409e-aade-48ef-b06b-737564c9e462',
};

export const postFilterExample: PostFilter = {
  subject: 'subject',
  author: 'author',
};
