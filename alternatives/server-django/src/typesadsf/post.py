from pydantic.dataclasses import dataclass
# from .common import DBItem


@dataclass
class DBItem:
    created_at: datetime
    id: UUID
    updated_at: datetime


@dataclass
class Post:
    author: str
    content: str
    subject: str


@dataclass
class DBPost(DBItem, Post):
    pass
