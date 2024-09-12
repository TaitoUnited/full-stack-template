import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class KeyValue {
  @Field(() => String) key: string;
  @Field(() => String) value: string;
}

@ObjectType()
export class RequestDetails {
  @Field(() => String) url: string;
  @Field(() => [KeyValue]) headers: KeyValue[];
}
