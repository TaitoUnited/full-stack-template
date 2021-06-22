import {
  ClassType,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql';

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
      this.total = total;
      this.data = data;
    }

    @Field()
    total: number;

    @Field(() => [res])
    data: T[];
  }

  return Paginated;
}

export enum FilterType {
  EQ = 'EQ',
  NEQ = 'NEQ',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  LIKE = 'LIKE',
  ILIKE = 'ILIKE',
}

export enum FilterOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum ValueType {
  TEXT = 'TEXT',
  NUMBER = 'FLOAT',
  DATE = 'DATE',
}

registerEnumType(FilterType, {
  name: 'FilterType',
});

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
});

registerEnumType(ValueType, {
  name: 'ValueType',
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
    value: Item[Key],
    valueType: ValueType
  ) {
    this.type = type;
    this.field = field;
    this.value = value;
    this.valueType = valueType;
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

@InputType()
export class FilterGroup<Item extends Record<string, any>> {
  constructor(
    itemType: ClassType<Item>,
    operator: FilterOperator,
    filters: Filter<Item>[]
  ) {
    this.operator = operator;
    this.filters = filters;
  }

  @Field(() => FilterOperator)
  operator: FilterOperator;

  @Field(() => [Filter])
  filters: Filter<Item>[];
}

export enum OrderDirection {
  DESC = 'DESC',
  ASC = 'ASC',
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
});

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
