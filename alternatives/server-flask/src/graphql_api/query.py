import dataclasses
import re

import strawberry
from strawberry.types import Info

from src.messagebus import Messagebus
from src.attachment import views as attachment_views
from src.common import types as common_types
from src.graphql_api import types as gql_types
from src.post import views as post_views


@strawberry.type
class Query:
    """Root query."""
    @strawberry.field
    def allowed_post_attachment_mime_types(self) -> list[str]:
        """Returns all MIME types allowed for post attachments."""
        # TODO move elsewhere
        return [
          "image/*",
          "text/*",
          "application/pdf",
          # Excel (and OpenXML)
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          # Powerpoint (and OpenXML)
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ]

    @strawberry.field
    def post(self, id: str, info: Info) -> gql_types.Post | None:
        """Reads a post."""
        messagebus: Messagebus = info.context["messagebus"]
        if post := messagebus.run(post_views.read_post, post_id=id):
            return gql_types.Post(**dataclasses.asdict(post))
        return None

    @strawberry.field
    def post_attachment(
        self,
        info: Info,
        input: gql_types.ReadPostAttachmentInput,
    ) -> gql_types.Attachment:
        """Reads a post attachment."""
        messagebus: Messagebus = info.context["messagebus"]
        attachment = messagebus.run(
            attachment_views.read_attachment,
            id=input.id,
            post_id=input.post_id,
        )
        if not attachment:
            raise RuntimeError("Attachment not found.")
        return gql_types.Attachment(**dataclasses.asdict(attachment))

    @strawberry.field
    def posts(
        self,
        info: Info,
        pagination: common_types.Pagination | None = {"limit": 20, "offset": 0},
        order: common_types.Order | None = {
            "dir": common_types.OrderDirection.DESC,
            "field": "createdAt",
            "invertNullOrder": False,
        },
        filter_groups: list[common_types.FilterGroup] | None = [],
        search: str | None = None,
    ) -> gql_types.PaginatedPosts:
        """Searches posts."""
        if pagination is None:
            pagination = common_types.Pagination(limit=20, offset=0)
        if order is None:
            order = common_types.Order(
                dir=common_types.OrderDirection.DESC,
                field="created_at",
                invert_null_order=False,
            )
        else:
            order = dataclasses.replace(
                order,
                field=re.sub(r'(?<!^)(?=[A-Z])', '_', order.field).lower(),
            )

        messagebus: Messagebus = info.context["messagebus"]
        posts = messagebus.run(
            post_views.search_posts,
            pagination=pagination,
            order=order,
            filter_groups=filter_groups,
            search=search,
        )

        return gql_types.PaginatedPosts(
            total=posts.total,
            data=[gql_types.Post(**dataclasses.asdict(data)) for data in posts.data],
        )