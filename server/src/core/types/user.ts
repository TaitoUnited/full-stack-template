import { Field, InputType, ObjectType } from 'type-graphql';
import { Paginated } from '../../common/types/search';

@ObjectType()
export class User {
  @Field() id: string;
  @Field() createdAt: Date;
  @Field() updatedAt: Date;

  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field(() => String, { nullable: true }) language: string | null;

  externalIds: string[];
}

@InputType()
export class UserFilter {
  @Field() email?: string;
  @Field() firstName?: string;
  @Field() lastName?: string;
}

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}

@InputType()
export class CreateUserInput {
  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field(() => String, { nullable: true }) language?: string | null;
  @Field(() => [String], { defaultValue: [] }) externalIds: string[];
}

@InputType()
export class UpdateUserInput {
  @Field() id: string;

  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) firstName?: string | null;
  @Field(() => String, { nullable: true }) lastName?: string | null;
  @Field(() => String, { nullable: true }) language?: string | null;
  @Field(() => [String], { nullable: true }) externalIds?: string[] | null;
}

@InputType()
export class DeleteUserInput {
  @Field() id: string;
}

export const createUserExample: CreateUserInput = {
  email: 'john.doe@domain.com',
  firstName: 'John',
  lastName: 'Doe',
  language: 'EN',
  externalIds: [],
};

export const userExample: User = {
  id: 'user1-uuid',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...createUserExample,
  language: 'EN',
};

export const userFilterExample: UserFilter = {
  email: 'john.doe@domain.com',
  firstName: 'John',
  lastName: 'Doe',
};
