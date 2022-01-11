import { Field, ObjectType, registerEnumType } from 'type-graphql';

export enum EntityType {
  POST = 'POST',
  // TEMPLATE_GENERATE: Entity types
}

registerEnumType(EntityType, {
  name: 'EntityType',
});

export enum Operation {
  LIST = 'LIST',
  ADD = 'ADD',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

@ObjectType()
export class EntityId {
  @Field() id: string;
}
