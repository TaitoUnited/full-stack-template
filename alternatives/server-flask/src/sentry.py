import logging

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration


logger = logging.getLogger(__name__)


def connect_sentry(config: dict) -> None:
    """Connects sentry."""
    sentry_dsn = config["SENTRY_DSN"]
    if not sentry_dsn or not sentry_dsn.startswith("https"):
        logger.warning(f"Skipping sentry init (DSN not set up): {sentry_dsn}")
        return None

    sentry_sdk.init(dsn=sentry_dsn, integrations=[FlaskIntegration()])
    logger.info("Sentry connected.")
