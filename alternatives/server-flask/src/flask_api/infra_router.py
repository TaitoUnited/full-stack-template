from flask import Blueprint, current_app

from src.messagebus import Messagebus
from src.common.resources import PgDBI


bp = Blueprint("infra", __name__)


@bp.route("/config")
def get_config() -> dict:
    """Return configs that are required by web user interface or 3rd
    party clients.
    """
    # NOTE: This is a public endpoint. Do not return any secrets here!
    client_config = {
        "APP_VERSION": current_app.config["APP_VERSION"],
    }
    return {"data": client_config}


@bp.route("/healthz")
def get_healtz() -> dict:
    """Polled by Kubernetes to check that the container is alive."""
    return {"status": "OK"}


@bp.route("/uptimez")
def get_uptimez() -> dict:
    """Polled by uptime monitor to check that the system is alive."""
    messagebus: Messagebus = current_app.extensions["messagebus"]
    db = messagebus.resolve(PgDBI)
    db.execute("""SELECT 1""")

    return {"status": "OK"}
