import pytest

from src.attachment import (
    resources as attachment_resources,
    services as attachment_services,
)
from src.messagebus import Messagebus
from src.post import resources as post_resources, services as post_services
from tests.fakes import FakePgDB


@pytest.fixture
def config() -> dict:
    """Return test config."""
    return {}


@pytest.fixture
def pg_db() -> FakePgDB:
    return FakePgDB()


@pytest.fixture
def messagebus(config: dict, pg_db: FakePgDB) -> Messagebus:
    """Return messagebus."""
    messagebus = Messagebus(config=config)

    messagebus.register_resource(lambda: pg_db, interface=pg_db.Interface)

    messagebus.register_resource(post_resources.PostDaoPgDB)
    messagebus.register_handler(post_services.CreatePostHandler)
    messagebus.register_handler(post_services.DeletePostHandler)
    messagebus.register_handler(post_services.UpdatePostHandler)

    messagebus.register_resource(attachment_resources.AttachmentDaoPgDB)
    messagebus.register_handler(attachment_services.CreateAttachmentHandler)
    messagebus.register_handler(attachment_services.DeleteAttachmentHandler)
    messagebus.register_handler(attachment_services.UpdateAttachmentHandler)

    return messagebus
