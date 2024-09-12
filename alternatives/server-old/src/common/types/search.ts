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

export enum FilterOperator {
  EQ = 'EQ',
  NEQ = 'NEQ',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  LIKE = 'LIKE',
  ILIKE = 'ILIKE',
}

export enum FilterLogicalOperator {
  AND = 'AND',
  OR = 'OR',
}

export enum ValueType {
  TEXT = 'TEXT',
  NUMBER = 'FLOAT',
  DATE = 'DATE',
}

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
});

registerEnumType(FilterLogicalOperator, {
  name: 'FilterLogicalOperator',
});

registerEnumType(ValueType, {
  name: 'ValueType',
});

@InputType()
export class Filter<
  Item extends Record<string, any>,
  Key extends keyof Item = keyof Item,
> {
  constructor(
    field: Key,
    operator: FilterOperator,
    value: Item[Key],
    valueType: ValueType
  ) {
    this.field = field;
    this.operator = operator;
    this.value = value;
    this.valueType = valueType;
  }

  @Field(() => String)
  field: Key;

  @Field(() => FilterOperator)
  operator: FilterOperator;

  /*
    This is a string since GraphQL doesn't allow for union type inputs
    in an ideal world we would have this be String | Number | Date | ... but
    this will have to do, hence the valueType -field
  */
  @Field(() => String, { nullable: true })
  value: string | null;

  @Field(() => ValueType, {
    description: `Determines how the value is treated`,
    defaultValue: ValueType.TEXT,
  })
  valueType: ValueType;
}

@InputType()
export class FilterGroup<Item extends Record<string, any>> {
  constructor(operator: FilterLogicalOperator, filters: Filter<Item>[]) {
    this.operator = operator;
    this.filters = filters;
  }

  @Field(() => FilterLogicalOperator)
  operator: FilterLogicalOperator;

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
  constructor(
    field: string,
    dir: OrderDirection = OrderDirection.ASC,
    invertNullOrder = false
  ) {
    this.field = field;
    this.dir = dir;
    this.invertNullOrder = invertNullOrder;
  }

  @Field(() => String)
  field: string;

  @Field(() => OrderDirection, {
    description: `Determines whether to sort ascending or descending.`,
    defaultValue: OrderDirection.ASC,
  })
  dir: OrderDirection;

  @Field(() => Boolean, {
    description: `Determines whether NULL values are ordered first or last.`,
    defaultValue: false,
  })
  invertNullOrder: boolean;
}
