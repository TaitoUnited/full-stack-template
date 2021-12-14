import { Field, ObjectType } from 'type-graphql';

export enum EntityType {
  POST = 'post',
  USER = 'user',
}

export enum Operation {
  LIST = 'list',
  ADD = 'add',
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
}

@ObjectType()
export class EntityId {
  @Field() id: string;
}
