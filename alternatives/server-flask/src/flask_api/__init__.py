import logging
from time import time

from flask import current_app, Flask, g, has_request_context, Response, request

from src.messagebus import Messagebus
from src.common.resources import PgDBI
from src.flask_api.infra_router import bp as infra_bp
from src.flask_api.post_router import bp as post_bp
from src.logs import StackdriverJsonFormatter


class SDLoggerFlaskExtension(StackdriverJsonFormatter):
    def process_log_record(self, log_record):
        if has_request_context():
            latency = (time() - g.request_start) * 1000
            log_record["requestMs"] = int(latency)
            log_record["req"] = {
                "method": request.method,
                "url": request.url,
                "headers": {
                    k: v
                    for k, v in request.headers.items()
                    if k.lower() in current_app.config["NO_LOG_PATHS"]
                },
            }

        return super().process_log_record(log_record)


def start_db_tx() -> None:
    messagebus: Messagebus = current_app.extensions["messagebus"]
    db = messagebus.resolve(PgDBI)
    g.tx_token = db.start_tx()


def end_db_tx(exc: BaseException | None) -> None:
    messagebus: Messagebus = current_app.extensions["messagebus"]
    db = messagebus.resolve(PgDBI)
    db.end_tx(g.tx_token, rollback=exc is not None)


def track_request() -> None:
    g.request_start = time()


def log_request(response: Response) -> Response:
    if request.path in current_app.config["NO_LOG_PATHS"]:
        return response

    latency = (time() - g.request_start) * 1000
    current_app.logger.info(
        f"requestMs={latency:.0f}, "
        f"request={request.method} {request.url}, "
        f"response={response.status_code}"
    )

    return response


def handle_bad_request(e: Exception) -> tuple[dict, int]:
    """Catch-all exception handler."""
    # Create an id for the exception to make searching the logs
    # easier.
    e_id = id(e)
    setattr(e, "log_id", e_id)
    current_app.logger.exception(f"Unhandled exception id={e_id}", exc_info=e)
    # All werkzeug raised exceptions (404 etc) have response code
    # assigned to them.
    code = getattr(e, "code", 500)
    return {
        "error": {
            "message": str(e) if code < 500 else f"{code}: Unexpected error",
            "id": e_id,
        }
    }, code


def create_flask_app(messagebus: Messagebus) -> Flask:
    """Flask app factory."""
    flask_app = Flask(__name__)
    flask_app.config.from_mapping(messagebus.config)
    flask_app.extensions['messagebus'] = messagebus

    # Setup error handler
    flask_app.errorhandler(Exception)(handle_bad_request)

    # Setup DB connection for the request
    flask_app.teardown_request(end_db_tx)
    flask_app.before_request(start_db_tx)

    # Setup request/response logging
    log_config = {
        "force": True,
        "level": messagebus.config["COMMON_LOG_LEVEL"].upper(),
    }
    if messagebus.config["COMMON_LOG_FORMAT"] == "stackdriver":
        flask_formatter = SDLoggerFlaskExtension("%(levelname)s %(message)s")
        flask_handler = logging.StreamHandler()
        flask_handler.setFormatter(flask_formatter)
        log_config["handlers"] = [flask_handler]

    logging.basicConfig(**log_config)

    flask_app.after_request(log_request)
    flask_app.before_request(track_request)

    # Register routes
    flask_app.register_blueprint(infra_bp)
    flask_app.register_blueprint(post_bp)

    return flask_app
