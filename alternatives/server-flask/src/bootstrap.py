from src.messagebus import Messagebus
from src.common.resources import PgDB, S3Storage
from src.post import resources as post_resources, services as post_services
from src.attachment import (
    resources as attachment_resources,
    services as attachment_services,
)


def create_messagebus(config: dict) -> Messagebus:
    messagebus = Messagebus(config=config)

    messagebus.register_resource(PgDB)
    messagebus.register_resource(S3Storage)

    messagebus.register_resource(post_resources.PostDaoPgDB)
    messagebus.register_handler(post_services.CreatePostHandler)
    messagebus.register_handler(post_services.DeletePostHandler)
    messagebus.register_handler(post_services.UpdatePostHandler)

    messagebus.register_resource(attachment_resources.AttachmentDaoPgDB)
    messagebus.register_handler(attachment_services.CreateAttachmentHandler)
    messagebus.register_handler(attachment_services.DeleteAttachmentHandler)
    messagebus.register_handler(attachment_services.UpdateAttachmentHandler)

    return messagebus
