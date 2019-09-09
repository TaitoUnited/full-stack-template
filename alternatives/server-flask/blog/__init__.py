import typing
from flask import Flask

from . import config
from . import db
from . import posts
from . import routes
from . import sentry
from . import storage
from . import types # noqa



def create_app(
    test_config: typing.Optional[typing.Mapping[str, typing.Any]] = None,
) -> Flask:
    """Flask app factory.
    """
    app = Flask(__name__)

    if test_config is None:
        app.config.from_object(config.Config)
    else:
        # load the test config if passed in
        app.config.from_object(test_config)

    sentry.connect(app)

    if app.config['COMMON_LOG_FORMAT'] == 'stackdriver':
        import google.cloud.logging
        client = google.cloud.logging.Client(app.config['APP_NAME'])
        # Attaches a Google Stackdriver logging handler to the root logger
        client.setup_logging(app.config['COMMON_LOG_LEVEL'])

    @app.errorhandler(Exception)
    def handle_bad_request(e: Exception) -> typing.Any:
        """Catch-all exception handler.
        """
        return {'error': {'message': str(e)}}, 500

    app.register_blueprint(routes.bp)
    app.register_blueprint(posts.routes.bp)

    def setup_worker() -> None:
        db.connect(app)
        storage.connect(app)

    try:
        # If running behind uwsgi, init db as post fork op to avoid workers
        # sharing the connection pool.
        import uwsgidecorators
    except ImportError:
        setup_worker()
    else:
        uwsgidecorators.postfork(setup_worker)

    return app
