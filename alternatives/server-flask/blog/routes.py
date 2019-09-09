import typing
from flask import Blueprint, current_app
from blog import db


bp = Blueprint('infra', __name__)


@bp.route('/config')
def get_config() -> typing.Any:
    """Return configs that are required by web user interface or 3rd
    party clients.
    """
    # NOTE: This is a public endpoint. Do not return any secrets here!
    client_config = {
        'APP_VERSION': current_app.config['APP_VERSION'],
    }
    return {'data': client_config}


@bp.route('/healthz')
def get_healtz() -> typing.Any:
    """Polled by Kubernetes to check that the container is alive.
    """
    return {'status': 'OK'}


@bp.route('/uptimez')
def get_uptimez() -> typing.Any:
    """Polled by uptime monitor to check that the system is alive.
    """
    db.execute('SELECT 1')
    return {'status': 'OK'}
