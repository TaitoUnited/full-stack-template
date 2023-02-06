from dataclasses import dataclass

from src.attachment.types import Attachment, AttachmentDao, AttachmentData


@dataclass(frozen=True)
class UpdateAttachment:
    id: str
    data: AttachmentData


@dataclass(frozen=True)
class AttachmentUpdated:
    attachment: Attachment


class UpdateAttachmentHandler:
    """Update new attachment."""

    def __init__(self, attachment_dao: AttachmentDao) -> None:
        self.attachment_dao = attachment_dao
        self.messages: list = []

    def handle(self, msg: UpdateAttachment) -> None:
        attachment = self.attachment_dao.update(id=msg.id, data=msg.data)
        self.messages.append(AttachmentUpdated(attachment))
