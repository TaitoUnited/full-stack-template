from dataclasses import dataclass

from src.attachment.types import Attachment, AttachmentDao


@dataclass(frozen=True)
class DeleteAttachment:
    id: str


@dataclass(frozen=True)
class AttachmentDeleted:
    attachment: Attachment


class DeleteAttachmentHandler:
    """Delete new attachment."""

    def __init__(self, attachment_dao: AttachmentDao) -> None:
        self.attachment_dao = attachment_dao
        self.messages: list = []

    def handle(self, msg: DeleteAttachment) -> None:
        attachment = self.attachment_dao.delete(id=msg.id)
        self.messages.append(AttachmentDeleted(attachment))
