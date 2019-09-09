import os
from collections import defaultdict


def read_secret(name: str) -> str:
    with open(f'/run/secrets/{name}', 'r') as secret:
        return secret.read()


_config = defaultdict(
    lambda: None,  # type: ignore
    os.environ,
    )


class Config:
    # Environment
    COMMON_PROJECT = _config['COMMON_PROJECT'],
    COMMON_COMPANY = _config['COMMON_COMPANY'],
    COMMON_FAMILY = _config['COMMON_FAMILY'],
    COMMON_APPLICATION = _config['COMMON_APPLICATION'],
    COMMON_SUFFIX = _config['COMMON_SUFFIX'],
    COMMON_DOMAIN = _config['COMMON_DOMAIN'],
    COMMON_IMAGE_TAG = _config['COMMON_IMAGE_TAG'],
    COMMON_ENV = _config['COMMON_ENV'],  # dev / test / stag / prod
    PYTHON_ENV = _config['PYTHON_ENV'],  # development / production

    # Basic
    ROOT_PATH = os.path.dirname(os.path.realpath(__file__))
    APP_NAME = 'full-stack-template-server'
    DEBUG = bool(_config['COMMON_DEBUG'])
    APP_VERSION = (
      f"{_config['BUILD_VERSION']}+local"
      if not _config['BUILD_IMAGE_TAG']
      else f"{_config['BUILD_VERSION']}+{_config['BUILD_IMAGE_TAG']}"
      )
    API_PORT = int(_config.get('API_PORT', -1))
    API_BINDADDR = _config['API_BINDADDR']

    # Cache
    CACHE_HOST = _config['CACHE_HOST']
    CACHE_PORT = int(_config.get('CACHE_PORT', -1))

    # Sentry
    APP_SENTRY_DSN = _config.get('APP_SENTRY_DSN', '')

    # Database
    DATABASE_HOST = _config['DATABASE_HOST']
    DATABASE_PORT = int(_config.get('DATABASE_PORT', 5432))
    DATABASE_NAME = _config['DATABASE_NAME']
    DATABASE_USER = _config['DATABASE_USER']
    DATABASE_PASSWORD = read_secret('DATABASE_PASSWORD')
    DATABASE_POOL_MAX = int(_config.get('DATABASE_POOL_MAX', 10))
    DATABASE_POOL_MIN = int(_config.get('DATABASE_POOL_MIN', 1))
    DATABASE_MAX_RETRIES = int(_config.get('DATABASE_MAX_RETRIES', 5))

    # Storage
    S3_URL = _config['S3_URL']
    S3_REGION = _config['S3_REGION']
    S3_BUCKET = _config['S3_BUCKET']
    S3_KEY_ID = _config['S3_KEY_ID']
    S3_KEY_SECRET = read_secret('S3_KEY_SECRET')
    S3_FORCE_PATH_STYLE = bool(_config['S3_FORCE_PATH_STYLE'])

    # Logging
    COMMON_LOG_LEVEL = _config['COMMON_LOG_LEVEL']
    COMMON_LOG_FORMAT = _config['COMMON_LOG_FORMAT']

    # Testing
    TESTING = False


class TestConfig(Config):
    TESTING = True
