import { ObjectType, ID, Field, InputType } from 'type-graphql';
import { Paginated } from '../../common/types/search';

// Objects --------------------------------------------------------------------

@ObjectType()
export class User {
  @Field(() => ID) id: string;
  @Field(() => String) email: string;
  @Field(() => String) firstName: string;
  @Field(() => String) lastName: string;
  @Field(() => String) phoneNumber: string;
  passHash: string;
}

export const userSchema: User = {
  id: 'id',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  phoneNumber: 'phoneNumber',
  passHash: 'passHash',
};

@ObjectType()
export class LoginUserResult {
  @Field(() => String) accessToken: string;
  @Field(() => String) refreshToken: string;
}

@ObjectType()
export class RegisterUserResult {
  @Field(() => User) user: User;
  @Field(() => String) accessToken: string;
  @Field(() => String) refreshToken: string;
}

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}

// Inputs --------------------------------------------------------------------

@InputType()
export class LoginUserInput {
  @Field() email: string;
  @Field() password: string;
}

@InputType()
export class UserFilter {
  @Field() email: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() phoneNumber: string;
}

export const userFilterSchema: UserFilter = {
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  phoneNumber: 'phoneNumber',
};

@InputType()
export class RegisterUserInput {
  @Field(() => String) email: string;
  @Field(() => String) password: string;
  @Field(() => String) firstName: string;
  @Field(() => String) lastName: string;
  @Field(() => String) phoneNumber: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => ID) id: string;
  @Field(() => String, { nullable: true }) firstName: string | null;
  @Field(() => String, { nullable: true }) lastName: string | null;
  @Field(() => String, { nullable: true }) phoneNumber: string | null;
}

export const updateUserSchema: UpdateUserInput = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  phoneNumber: 'phoneNumber',
};

// Create a type alias for a less confusing name used in the DAO
export type CreateUserInput = RegisterUserInput;

export const createUserSchema: Omit<User, 'id'> = {
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  phoneNumber: 'phoneNumber',
  passHash: 'passHash',
};

// Delete

@InputType()
export class DeleteUserInput {
  @Field() id: string;
}
