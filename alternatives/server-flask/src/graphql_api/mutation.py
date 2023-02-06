import dataclasses

import strawberry
from strawberry.types import Info

from src.messagebus import Messagebus
from src.attachment import (
    services as attachment_services,
    types as attachment_types,
    views as attachment_views,
)
from src.common import types as common_types
from src.graphql_api import types as gql_types
from src.post import (
    services as post_services,
    types as post_types,
    views as post_views,
)


@strawberry.type
class Mutation:
    """Root mutation."""

    @strawberry.field
    def create_post(
        self,
        info: Info,
        input: gql_types.CreatePostInput,
    ) -> gql_types.Post:
        messagebus: Messagebus = info.context["messagebus"]
        recap = messagebus.handle(post_services.CreatePost(data=input))
        result = next(
            step.message for step in recap.queue
            if isinstance(step.message, post_services.PostCreated)
        )
        return gql_types.Post(**dataclasses.asdict(result.post))

    @strawberry.field
    def create_post_attachment(
        self,
        info: Info,
        input: gql_types.CreatePostAttachmentInput,
    ) -> gql_types.AttachmentUploadRequestDetails:
        messagebus: Messagebus = info.context["messagebus"]
        recap = messagebus.handle(attachment_services.CreateAttachment(data=input))
        result = next(
            step.message for step in recap.queue
            if isinstance(step.message, attachment_services.AttachmentCreated)
        )
        upload_details = messagebus.run(
            attachment_views.get_post_attachment_upload_details,
            attachment=result.attachment,
        )
        return gql_types.AttachmentUploadRequestDetails(
            headers=upload_details.headers,
            id=result.attachment.id,
            url=upload_details.url,
        )

    @strawberry.field
    def delete_post(
        self,
        info: Info,
        input: gql_types.DeletePostInput,
    ) -> gql_types.Post:
        messagebus: Messagebus = info.context["messagebus"]
        recap = messagebus.handle(post_services.DeletePost(id=input.id))
        result = next(
            step.message for step in recap.queue
            if isinstance(step.message, post_services.PostDeleted)
        )
        return gql_types.Post(**dataclasses.asdict(result.post))

    @strawberry.field
    def delete_post_attachment(
        self,
        info: Info,
        input: gql_types.DeletePostAttachmentInput,
    ) -> gql_types.Attachment:
        messagebus: Messagebus = info.context["messagebus"]
        recap = messagebus.handle(attachment_services.DeleteAttachment(id=input.id))
        result = next(
            step.message for step in recap.queue
            if isinstance(step.message, attachment_services.AttachmentDeleted)
        )
        return gql_types.Attachment(**dataclasses.asdict(result.attachment))

    @strawberry.field
    def finalize_post_attachment(
        self,
        info: Info,
        input: gql_types.FinalizePostAttachmentInput,
    ) -> gql_types.Attachment:
        messagebus: Messagebus = info.context["messagebus"]
        attachment = messagebus.run(
            attachment_views.read_attachment,
            id=input.id,
            post_id=input.post_id,
        )
        if not attachment:
            raise RuntimeError("Attachment not found.")

        attachment = dataclasses.replace(
            attachment,
            lifecycle_status=common_types.LifecycleStatus.CREATED,
        )

        recap = messagebus.handle(
            attachment_services.UpdateAttachment(
                id=input.id,
                data=attachment_types.AttachmentData(
                    **dataclasses.asdict(attachment),
                ),
            ),
        )
        result = next(
            step.message for step in recap.queue
            if isinstance(step.message, attachment_services.AttachmentUpdated)
        )
        return gql_types.Attachment(**dataclasses.asdict(result.attachment))

    @strawberry.field
    def update_post(
        self,
        info: Info,
        input: gql_types.UpdatePostInput,
    ) -> gql_types.Post:
        messagebus: Messagebus = info.context["messagebus"]
        post = messagebus.run(
            post_views.read_post,
            id=input.id,
            post_id=input.id,
        )
        if not post:
            raise RuntimeError("Post not found.")

        post = dataclasses.replace(
            post,
            author=input.author,
            content=input.content,
            id=input.id,
            subject=input.subject,
        )

        recap = messagebus.handle(
            post_services.UpdatePost(
                id=input.id,
                data=post_types.PostData(
                    **dataclasses.asdict(post),
                ),
            ),
        )
        result = next(
            step.message for step in recap.queue
            if isinstance(step.message, post_services.PostUpdated)
        )
        return gql_types.Post(**dataclasses.asdict(result.post))

    @strawberry.field
    def update_post_attachment(
        self,
        info: Info,
        input: gql_types.UpdatePostAttachmentInput,
    ) -> gql_types.Attachment:
        messagebus: Messagebus = info.context["messagebus"]
        attachment = messagebus.run(
            attachment_views.read_attachment,
            id=input.id,
            post_id=input.post_id,
        )
        if not attachment:
            raise RuntimeError("Attachment not found.")

        attachment = dataclasses.replace(
            attachment,
            lifecycle_status=common_types.LifecycleStatus.CREATED,
        )

        recap = messagebus.handle(
            attachment_services.UpdateAttachment(
                id=input.id,
                data=attachment_types.AttachmentData(
                    **dataclasses.asdict(attachment),
                ),
            ),
        )
        result = next(
            step.message for step in recap.queue
            if isinstance(step.message, attachment_services.AttachmentUpdated)
        )
        return gql_types.Attachment(**dataclasses.asdict(result.attachment))
