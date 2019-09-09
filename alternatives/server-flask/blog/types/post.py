from pydantic.dataclasses import dataclass
from .common import DBItem


@dataclass
class Post:
    author: str
    content: str
    subject: str


@dataclass
class DBPost(DBItem, Post):
    pass
