from dataclasses import dataclass
from datetime import datetime
from enum import Enum


@dataclass
class DBItem:
    created_at: datetime
    id: str
    updated_at: datetime


class LifecycleStatus(Enum):
  INITIALIZED = "INITIALIZED"
  CREATED = "CREATED"
  DELETED = "DELETED"


@dataclass
class User:
    email: str
    first_name: str
    language: str
    last_name: str
    username: str


class OrderDirection(Enum):
    ASC = "ASC"
    DESC = "DESC"


@dataclass
class Order:
    """Determines whether to sort ascending or descending."""
    field: str
    invert_null_order: bool | None = False
    dir: OrderDirection | None = OrderDirection.ASC


class FilterLogicalOperator(Enum):
    AND = "AND"
    OR = "OR"


class ValueType(Enum):
  TEXT = "TEXT"
  NUMBER = "FLOAT"
  DATE = "DATE"


class FilterOperator(Enum):
    EQ = "EQ"
    NEQ = "NEQ"
    GT = "GT"
    GTE = "GTE"
    LT = "LT"
    LTE = "LTE"
    LIKE = "LIKE"
    ILIKE = "ILIKE"


@dataclass
class Filter:
  field: str
  operator: FilterOperator
  value: str
  valueType: ValueType = ValueType.TEXT


@dataclass
class FilterGroup:
    filters: list[Filter]
    operator: FilterLogicalOperator


@dataclass
class Pagination:
    limit: int | None = 20
    offset: int = 0


@dataclass
class KeyValue:
    key: str
    value: str


@dataclass
class RequestDetails:
    url: str
    headers: list[KeyValue]
