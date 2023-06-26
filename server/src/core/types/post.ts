import { MaxLength, MinLength } from 'class-validator';
import { Field, InputType, ObjectType, ID } from 'type-graphql';
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

// Filter
/* eslint-disable camelcase */

@InputType()
export class PostFilter {
  @Field() id?: string = undefined;
  @Field() createdAt?: Date = undefined;
  @Field() updatedAt?: Date = undefined;

  // EXAMPLE: Filter by column of a referenced entity
  // See also JOIN_FRAGMENT EXAMPLE on DAO as you must JOIN
  // user AS assigned_user.
  //
  // @Field() ref_assignedUser_username?: string = undefined;
}

// Create

@InputType()
export class CreatePostInput {
  @Field(() => String)
  @MinLength(5)
  @MaxLength(500)
  subject: string;

  @Field(() => String)
  content: string;

  @Field(() => String)
  @MinLength(2)
  @MaxLength(100)
  author: string;
}

// Update

@InputType()
export class UpdatePostInput {
  @Field() id: string;
  @Field(() => String, { nullable: true })
  @MinLength(5)
  @MaxLength(500)
  subject?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => String, { nullable: true })
  @MinLength(2)
  @MaxLength(100)
  author?: string;
}

// Delete

@InputType()
export class DeletePostInput {
  @Field() id: string;
}
