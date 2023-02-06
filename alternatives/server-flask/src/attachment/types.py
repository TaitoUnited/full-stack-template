from collections.abc import Sequence
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Protocol

from src.common import types as common_types


class AttachmentType(Enum):
  ATTACHMENT = "ATTACHMENT"
  PHOTO = "PHOTO"


@dataclass
class AttachmentData:
  attachment_type: AttachmentType
  content_type: str
  filename: str
  title: str
  description: str
  post_id: str
  lifecycle_status: common_types.LifecycleStatus = common_types.LifecycleStatus.DELETED


@dataclass
class Attachment(AttachmentData, common_types.DBItem):
    pass


@dataclass
class AttachmentFilter:
    attachmentType: str
    contentType: str
    created_at: datetime
    description: str
    filename: str
    id: str
    post_id: str
    title: str
    updated_at: datetime


@dataclass
class PaginatedAttachments:
    data: Sequence[Attachment]
    total: int


class AttachmentDao(Protocol):

    def search(
        self,
        search: str | None,
        filter_groups: list[common_types.FilterGroup],
        order: common_types.Order,
        pagination: common_types.Pagination,
    ) -> PaginatedAttachments:
        ...

    def read(self, id: str, post_id: str | None) -> Attachment | None:
        ...

    def create(self, data: AttachmentData) -> Attachment:
        ...

    def finalize(self, id: str) -> Attachment:
        ...

    def update(self, id: str, data: AttachmentData) -> Attachment:
        ...

    def delete(self, id: str) -> Attachment:
        ...
