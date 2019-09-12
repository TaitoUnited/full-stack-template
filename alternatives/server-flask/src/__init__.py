import typing
from flask import Flask


def create_app(
    test_config: typing.Optional[typing.Mapping[str, typing.Any]] = None,
) -> Flask:
    """Flask app factory.
    """
    app = Flask(__name__)

    if test_config is None:
        from . import config
        app.config.from_object(config.Config)
    else:
        # load the test config if passed in
        app.config.from_object(test_config)

    from . import log, sentry
    log.setup(app)
    sentry.connect(app)

    @app.errorhandler(Exception)
    def handle_bad_request(e: Exception) -> typing.Any:
        """Catch-all exception handler.
        """
        # Create an id for the exception to make searching the logs
        # easier.
        e_id = id(e)
        setattr(e, 'log_id', e_id)
        app.logger.exception(f'Unhandled exception ({e_id}): {e}')
        # All werkzeug raised exceptions (404 etc) have response code
        # assigned to them.
        code = getattr(e, 'code', 500)
        return {'error': {'message': str(e), 'id': e_id}}, code

    def setup_worker() -> None:
        # Connect infra
        from . import db, storage
        db.connect(app)
        storage.connect(app)

        # Register routes
        from . import posts, routes
        app.register_blueprint(routes.bp)
        app.register_blueprint(posts.routes.bp)

    try:
        # If running behind uwsgi, init db as post fork op to avoid workers
        # sharing the connection pool.
        import uwsgidecorators
    except ImportError:
        setup_worker()
    else:
        uwsgidecorators.postfork(setup_worker)

    return app
