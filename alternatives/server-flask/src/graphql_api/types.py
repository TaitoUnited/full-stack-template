import dataclasses
import re

import strawberry
from strawberry.types import Info

from src.messagebus import Messagebus
from src.common import types as common_types
from src.post import types as post_types
from src.attachment import types as attachment_types, views as attachment_views


# Cast to strawberry-compatible types
strawberry.enum(common_types.OrderDirection)
strawberry.input(common_types.Order)
strawberry.input(common_types.Pagination)
strawberry.input(common_types.Order)
strawberry.enum(common_types.LifecycleStatus)
strawberry.enum(attachment_types.AttachmentType)
strawberry.enum(common_types.ValueType)
strawberry.enum(common_types.FilterLogicalOperator)
strawberry.enum(common_types.FilterOperator)
strawberry.input(common_types.Filter)
strawberry.input(common_types.FilterGroup)
strawberry.type(common_types.KeyValue)


@strawberry.input
class ReadPostAttachmentInput:
    id: str
    post_id: str


@strawberry.type
class Attachment(attachment_types.Attachment):
    attachment_type: strawberry.Private[attachment_types.AttachmentType]
    lifecycle_status: strawberry.Private[common_types.LifecycleStatus]
    id: strawberry.ID

    @strawberry.field
    def file_url(self, info: Info) -> str:
        messagebus: Messagebus = info.context["messagebus"]
        return messagebus.run(
            attachment_views.get_post_attachment_download_url,
            attachment=self,
        )


@strawberry.type
@dataclasses.dataclass
class PaginatedAttachments(attachment_types.PaginatedAttachments):
    data: list[Attachment]


@strawberry.type
class Post(post_types.Post):
    id: strawberry.ID

    @strawberry.field
    def attachments(
        self,
        info: Info,
        attachment_order: common_types.Order | None = {
            "dir": common_types.OrderDirection.ASC,
            "field": "createdAt",
            "invertNullOrder": True,
        },
    ) -> PaginatedAttachments:
        if attachment_order is None:
            attachment_order = common_types.Order(
                dir=common_types.OrderDirection.ASC,
                field="created_at",
                invert_null_order=True,
            )
        else:
            attachment_order = dataclasses.replace(
                attachment_order,
                field=re.sub(r'(?<!^)(?=[A-Z])', '_', attachment_order.field).lower(),
            )
        messagebus: Messagebus = info.context["messagebus"]
        attachments = messagebus.run(
            attachment_views.search_attachments,
            pagination=common_types.Pagination(limit=None, offset=0),
            order=attachment_order,
            filter_groups=[
                common_types.FilterGroup(
                    filters=[
                        common_types.Filter(
                            field="post_id",
                            operator=common_types.FilterOperator.EQ,
                            value=self.id,
                        )
                    ],
                    operator=common_types.FilterLogicalOperator.AND,
                )
            ],
            search=None,
        )
        return PaginatedAttachments(
            total=attachments.total,
            data=[Attachment(**dataclasses.asdict(data)) for data in attachments.data],
        )


@strawberry.type
@dataclasses.dataclass
class PaginatedPosts(post_types.PaginatedPosts):
    data: list[Post]




@strawberry.type
@dataclasses.dataclass
class AttachmentUploadRequestDetails:
    headers: list[common_types.KeyValue]
    id: str
    url: str


@strawberry.input
class FinalizePostAttachmentInput:
    id: str
    post_id: str


@strawberry.input
class UpdatePostInput:
    author: str
    content: str
    id: str
    subject: str


@strawberry.input
class UpdatePostAttachmentInput:
    description: str
    id: str
    post_id: str
    title: str


@strawberry.input
class UpdateAttachmentInput:
    description: str
    id: str
    title: str


@strawberry.input
class UpdateAttachmentInputBase:
    id: str


@strawberry.input
class CreateAttachmentInputBase:
    contentType: str
    filename: str


@strawberry.input
class CreatePostAttachmentInput(attachment_types.AttachmentData):
    lifecycle_status: strawberry.Private[common_types.LifecycleStatus]
    attachment_type: strawberry.Private[attachment_types.AttachmentType] = (
        attachment_types.AttachmentType.ATTACHMENT
    )


@strawberry.input
class CreatePostInput(post_types.PostData):
  pass


@strawberry.input
class DeleteAttachmentInput:
    id: str


@strawberry.input
class DeletePostAttachmentInput:
    id: str
    post_id: str


@strawberry.input
class DeletePostInput:
    id: str
