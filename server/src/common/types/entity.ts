import { Field, ObjectType, registerEnumType } from 'type-graphql';

export enum EntityType {
  POST = 'POST',
  USER = 'USER',
  // TEMPLATE_GENERATE: Entity types
}

registerEnumType(EntityType, {
  name: 'EntityType',
});

export enum Operation {
  LIST = 'LIST',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
