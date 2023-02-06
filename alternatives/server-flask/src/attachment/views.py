from src.common.resources import S3Storage
from src.common import types as common_types
from src.attachment.types import PaginatedAttachments, Attachment, AttachmentDao


def get_post_attachment_storage_path(attachment: Attachment) -> str:
    return f"posts/{attachment.post_id}/{str(attachment.attachment_type).lower()}s/"


def search_attachments(
    attachment_dao: AttachmentDao,
    pagination: common_types.Pagination,
    order: common_types.Order,
    filter_groups: list[common_types.FilterGroup],
    search: str | None = None,
) -> PaginatedAttachments:
    return attachment_dao.search(
        pagination=pagination,
        order=order,
        filter_groups=filter_groups,
        search=search,
    )


def read_attachment(
    attachment_dao: AttachmentDao,
    id: str,
    post_id: str | None,
) -> Attachment | None:
    return attachment_dao.read(id=id, post_id=post_id)


def get_post_attachment_upload_details(
    s3: S3Storage,
    attachment: Attachment,
) -> common_types.RequestDetails:
    content_type = attachment.content_type
    content_disposition = f'attachment; filename="{attachment.filename}"'

    url = s3.create_presigned_url_put_object(
        path=get_post_attachment_storage_path(attachment),
        content_type=content_type,
        content_disposition=content_disposition,
    )

    return common_types.RequestDetails(
        url=url,
        headers=[
            common_types.KeyValue(
                key="Content-Type",
                value=content_type,
            ),
            common_types.KeyValue(
                key="Content-Disposition",
                value=content_disposition,
            ),
        ]
    )


def get_post_attachment_download_url(
    s3: S3Storage,
    attachment: Attachment,
) -> str:
    return s3.create_presigned_url_get_object(
        path=get_post_attachment_storage_path(attachment),
    )
