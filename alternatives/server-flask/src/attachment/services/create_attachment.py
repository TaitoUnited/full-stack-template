from dataclasses import dataclass

from src.attachment.types import Attachment, AttachmentDao, AttachmentData


@dataclass(frozen=True)
class CreateAttachment:
    data: AttachmentData


@dataclass(frozen=True)
class AttachmentCreated:
    attachment: Attachment


class CreateAttachmentHandler:
    """Create new attachment."""

    def __init__(self, attachment_dao: AttachmentDao) -> None:
        self.attachment_dao = attachment_dao
        self.messages: list = []

    def handle(self, msg: CreateAttachment) -> None:
        attachment = self.attachment_dao.create(msg.data)
        self.messages.append(AttachmentCreated(attachment))
