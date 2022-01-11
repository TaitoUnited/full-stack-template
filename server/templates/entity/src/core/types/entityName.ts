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

export const entityNameExample: EntityName = {
  // TEMPLATE_GENERATE: Read entity field examples
};

// Filter

@InputType()
export class EntityNameFilter {
  @Field() createdAt: Date;
  @Field() updatedAt: Date;

  // EXAMPLE: Filter by column of a referenced entity
  // See also JOIN_FRAGMENT EXAMPLE on DAO. You must JOIN
  // user AS assigned_user.
  //
  // @Field() assignedUser_username: string;
}

export const entityNameFilterExample: EntityNameFilter = {};

// Create

@InputType()
export class CreateEntityNameInput {
  // TEMPLATE_GENERATE: Create entity fields
}

export const createEntityNameExample: CreateEntityNameInput = {
  // TEMPLATE_GENERATE: Create entity field examples
};

// Update

@InputType()
export class UpdateEntityNameInput {
  @Field() id: string;
  // TEMPLATE_GENERATE: Update entity fields
}
export const updateEntityNameExample: Omit<UpdateEntityNameInput, 'id'> = {
  // TEMPLATE_GENERATE: Update entity field examples
};

// Delete

@InputType()
export class DeleteEntityNameInput {
  @Field() id: string;
}
