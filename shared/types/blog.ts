import { Field, InputType, ObjectType } from 'type-graphql';

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

@InputType()
export class CreatePostInput {
  @Field()
  subject: string;

  @Field()
  content: string;

  @Field()
  author: string;
}
