import { Field, InputType, ObjectType } from "type-graphql";
import { Paginated } from "./common";

@ObjectType()
export class Post {
  @Field()
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  subject: string;

  @Field()
  content: string;

  @Field()
  author: string;
}

@ObjectType()
export class PaginatedPosts extends Paginated(Post) {}

@InputType()
export class CreatePostInput {
  @Field()
  subject: string;

  @Field()
  content: string;

  @Field()
  author: string;
}
