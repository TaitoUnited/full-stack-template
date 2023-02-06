import logging
from os import environ
from typing import Any

from marshmallow import Schema, EXCLUDE, post_load
from marshmallow.fields import Boolean, Integer, String


logger = logging.getLogger(__name__)


class Config(Schema):
    API_PORT = Integer(load_default=4000)
    API_BINDADDR = String(load_default="127.0.0.1")
    BASE_PATH = String(load_default="/api")
    NO_LOG_PATHS = String(load_default="/healthz, /uptimez")
    NO_LOG_HEADERS = String(load_default="user-agent, referer, x-real-ip")

    CACHE_HOST = String()
    CACHE_PORT = Integer()

    DATABASE_HOST = String()
    DATABASE_PORT = Integer(load_default=5432)
    DATABASE_NAME = String()
    DATABASE_USER = String()
    DATABASE_PASSWORD = String()
    DATABASE_POOL_MAX = Integer(load_default=10)
    DATABASE_POOL_MIN = Integer(load_default=4)
    DATABASE_SSL_ENABLED = Boolean(load_default=True)
    DATABASE_SSL_CLIENT_CERT_ENABLED = Boolean(load_default=False)
    DATABASE_SSL_SERVER_CERT_ENABLED = Boolean(load_default=False)

    REDIS_HOST = String()
    REDIS_PORT = Integer(load_default=6379)

    SENTRY_DSN = String(load_default=None)

    BUCKET_ENDPOINT = String()
    BUCKET_REGION = String()
    BUCKET_BUCKET = String()
    BUCKET_GCP_PROJECT_ID = String()
    BUCKET_BROWSE_URL = String()
    BUCKET_DOWNLOAD_URL = String()
    BUCKET_KEY_ID = String()
    BUCKET_KEY_SECRET = String()
    BUCKET_FORCE_PATH_STYLE = String()

    COMMON_COMPANY = String(load_default=None)
    COMMON_PROJECT = String(load_default=None)
    COMMON_DEBUG = Boolean(load_default=True)
    COMMON_LOG_FORMAT = String(load_default='text')
    COMMON_LOG_LEVEL = String(load_default=None)
    COMMON_ENV = String(load_default=None)
    COMMON_FAMILY = String(load_default=None)
    COMMON_APPLICATION = String(load_default=None)
    COMMON_SUFFIX = String(load_default=None)
    COMMON_DOMAIN = String(load_default=None)
    COMMON_IMAGE_TAG = String(load_default=None)

    @post_load
    def convert_no_log_paths_to_list(self, in_data: dict, **kwargs) -> dict:
        in_data["NO_LOG_PATHS"] = [
            path.strip() for path in in_data["NO_LOG_PATHS"].split(",")
        ]
        return in_data

    @post_load
    def convert_no_log_headers_to_list(self, in_data: dict, **kwargs) -> dict:
        in_data["NO_LOG_HEADERS"] = [
            path.strip() for path in in_data["NO_LOG_HEADERS"].split(",")
        ]
        return in_data


def read_secret_from_file(filename) -> str:
    try:
        with open(f"/run/secrets/{filename}") as secret_file:
            return secret_file.read()
    except OSError:
        logger.warning(f"Failed to read secret {filename}")
    return ""


def get_config() -> dict[str, Any]:
    """Read config from env."""
    secrets = {
        "BUCKET_KEY_SECRET": read_secret_from_file("BUCKET_KEY_SECRET"),
        "DATABASE_PASSWORD": read_secret_from_file("DATABASE_PASSWORD"),
        "REDIS_PASSWORD": read_secret_from_file("REDIS_PASSWORD"),
    }
    return Config().load(dict(environ) | secrets, unknown=EXCLUDE)
