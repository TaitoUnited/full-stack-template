from collections.abc import Sequence
from dataclasses import dataclass
from datetime import datetime
from typing import Protocol

from src.common import types as common_types


@dataclass
class PostData:
    author: str
    content: str
    subject: str


@dataclass
class Post(common_types.DBItem, PostData):
    pass


class PostFilter:
    created_at: datetime
    id: str
    updated_at: datetime


@dataclass
class PaginatedPosts:
    data: Sequence[Post]
    total: int


class PostDao(Protocol):
    """Generic protocol for accessing Post data."""

    def create(self, data: PostData) -> Post:
        ...

    def read(self, post_id: str) -> Post | None:
        ...

    def search(
        self,
        pagination: common_types.Pagination,
        order: common_types.Order,
        filter_groups: list[common_types.FilterGroup],
        search: str | None = None,
    ) -> PaginatedPosts:
        ...

    def update(self, id: str, data: PostData) -> Post:
        ...

    def delete(self, id: str) -> Post:
        ...
