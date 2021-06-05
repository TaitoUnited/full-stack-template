import {
  ClassType,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";

@InputType()
export class Pagination {
  constructor(offset: number, limit: number) {
    this.offset = offset;
    this.limit = limit;
  }

  @Field()
  offset: number;

  @Field()
  limit: number;
}

export function Paginated<T>(res: ClassType<T>) {
  @ObjectType({
    isAbstract: true,
  })
  abstract class Paginated {
    constructor({ total, data }: { total: number; data: T[] }) {
      this.data = data;
      this.total = total;
    }

    @Field(() => [res])
    data: T[];

    @Field()
    total: number;
  }

  return Paginated;
}

export enum FilterType {
  LIKE = "like",
  EXACT = "exact",
}

export enum ValueType {
  TEXT = "text",
  NUMBER = "float",
  DATE = "datetime",
}

registerEnumType(FilterType, {
  name: "FilterType",
});

registerEnumType(ValueType, {
  name: "ValueType",
});

@InputType()
export class Filter<
  Item extends Record<string, any>,
  Key extends keyof Item = keyof Item
> {
  constructor(
    itemType: ClassType<Item>,
    type: FilterType,
    field: Key,
    value: Item[Key]
  ) {
    this.type = type;
    this.field = field;
    this.value = value;
  }

  @Field(() => FilterType)
  type: FilterType;

  @Field(() => String)
  field: Key;

  /*
    This is a string since GraphQL doesn't allow for union type inputs
    in an ideal world we would have this be String | Number | Date | ... but
    this will have to do.

    hence the valueType -field
  */
  @Field(() => String)
  value: string;

  @Field(() => ValueType, {
    description: `Determines how the value is treated`,
    defaultValue: ValueType.TEXT,
  })
  valueType: ValueType;
}

export enum OrderDirection {
  DESC = "desc",
  ASC = "asc",
}

registerEnumType(OrderDirection, {
  name: "OrderDirection",
});

/*
  NOTE: maybe should make this into a function returning a class
  i.e. the usage would be somthing like

  enum CustomerField {
    id = 'id',
    name = 'name'
  }

  ...
  @Field(() => Order(CustomerField))
*/
@InputType()
export class Order {
  constructor(dir: OrderDirection, field: string) {
    this.dir = dir;
    this.field = field;
  }

  @Field(() => OrderDirection)
  dir: OrderDirection;

  @Field(() => String)
  field: string;
}
