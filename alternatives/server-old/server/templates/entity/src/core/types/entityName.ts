import { Field, InputType, ObjectType, Float, Int, ID } from 'type-graphql';
import { Paginated } from '../../common/types/search';
// TEMPLATE_GENERATE: Imports

// Read

@ObjectType()
export class EntityName {
  // TEMPLATE_GENERATE: Read entity fields
}

@ObjectType()
export class PaginatedEntityNames extends Paginated(EntityName) {}

// Filter
/* eslint-disable camelcase */

@InputType()
export class EntityNameFilter {
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
export class CreateEntityNameInput {
  // TEMPLATE_GENERATE: Create entity fields
}

// Update

@InputType()
export class UpdateEntityNameInput {
  @Field() id: string;
  // TEMPLATE_GENERATE: Update entity fields
}

// Delete

@InputType()
export class DeleteEntityNameInput {
  @Field() id: string;
}
