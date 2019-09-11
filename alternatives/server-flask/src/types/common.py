from datetime import datetime
from pydantic.dataclasses import dataclass
from uuid import UUID


@dataclass
class DBItem:
    created_at: datetime
    id: UUID
    updated_at: datetime


@dataclass
class User:
    email: str
    first_name: str
    language: str
    last_name: str
    username: str
