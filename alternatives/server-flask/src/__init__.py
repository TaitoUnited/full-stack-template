import os
import typing
from flask import Flask
from . import api


def create_app(
    test_config: typing.Optional[typing.Mapping[str, typing.Any]] = None,
) -> Flask:
    """Flask app factory."""
    app = Flask(__name__)

    if test_config is None:
        from src.common.setup import config

        app.config.from_object(config.Config)
    else:
        # load the test config if passed in
        app.config.from_object(test_config)

    from src.common.setup import log, sentry

    log.setup(app)
    sentry.connect(app)

    @app.errorhandler(Exception)
    def handle_bad_request(e: Exception) -> typing.Any:
        """Catch-all exception handler."""
        # Create an id for the exception to make searching the logs
        # easier.
        e_id = id(e)
        setattr(e, "log_id", e_id)
        app.logger.exception(f"Unhandled exception ({e_id}): {e}")
        # All werkzeug raised exceptions (404 etc) have response code
        # assigned to them.
        code = getattr(e, "code", 500)
        return {"error": {"message": str(e), "id": e_id}}, code

    def setup_worker() -> None:
        # Connect infra
        from src.common.setup import db, storage

        db.connect(app)
        storage.connect(app)
        api.register_rest_routes(app)
        api.register_graphql_resolvers(app)

    if os.environ.get("FLASK_ENV") == "development":
        setup_worker()
    else:
        import uwsgidecorators

        uwsgidecorators.postfork(setup_worker)

    return app
