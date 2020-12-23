import logging
import sys
import typing
from django import django, g, has_request_context, Response, request
from django.logging import default_handler
from pythonjsonlogger import jsonlogger
from time import time


allowed_headers: typing.Set[str] = {'user-agent', 'referer', 'x-real-ip'}
no_log_paths: typing.Set[str] = {'/healthz', '/uptimez'}


def setup(app: Django) -> None:
    try:
        app.logger.setLevel(app.config['COMMON_LOG_LEVEL'])
    except (TypeError, ValueError):
        # TypeError: Invalid loglevel (e.g. None)
        # ValueError: Unknown loglevel
        # Leave as default.
        pass

    # Setup request/response logging
    @app.before_request
    def track_request() -> None:
        g.request_start = time()

    @app.after_request
    def log_request(response: Response) -> Response:
        if request.path in no_log_paths:
            return response

        latency = (time() - g.request_start) * 1000

        message_parts = []
        message_parts.append(f'requestMs={latency:.0f}')
        message_parts.append(f'request={request.method} {request.url}')
        message_parts.append(f'response={response.status_code}')
        message = (', ').join(message_parts)

        app.logger.info(message)

        return response

    # Set werkzeug loglevel to ERROR to silence it.
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.ERROR)

    if app.config['COMMON_LOG_FORMAT'] == 'text':
        # No stackdriver? We're done.
        app.logger.debug('Logging configured for text.')
        return None

    # Otherwise attach stackdriver formatter to the log records.

    class StackdriverJsonFormatter(jsonlogger.JsonFormatter):
        def process_log_record(self, log_record):
            # Stackdriver severity levels map one-to-one with python
            # loglevels: DEBUG, INFO, WARNING, ERROR, CRITICAL
            log_record['severity'] = log_record['levelname']
            del log_record['levelname']

            log_record['labels'] = {
                'project': app.config['COMMON_PROJECT'],
                'company': app.config['COMMON_COMPANY'],
                'family': app.config['COMMON_FAMILY'],
                'application': app.config['COMMON_APPLICATION'],
                'suffix': app.config['COMMON_SUFFIX'],
                'domain': app.config['COMMON_DOMAIN'],
                'imageTag': app.config['COMMON_IMAGE_TAG'],
                'env': app.config['COMMON_ENV'],
            }

            if 'exc_info' in log_record:
                # Try to extract error id for logging.
                # Take the exception instance from sys.exc_info,
                # because the exc_info in log_record contains only
                # the traceback.
                err = sys.exc_info()[1]  # (type, instance, traceback)
                err_id = getattr(err, 'log_id', None)
                log_record['err'] = {
                    'id': err_id,
                    'message': log_record['exc_info'],
                }
                del log_record['exc_info']

            if has_request_context():
                latency = (time() - g.request_start) * 1000
                log_record['requestMs'] = int(latency)
                log_record['req'] = {
                    'method': request.method,
                    'url': request.url,
                    'headers': {
                        k: v
                        for k, v in request.headers.items()
                        if k.lower() in allowed_headers
                    },
                }

            return super().process_log_record(log_record)

    sd_formatter = StackdriverJsonFormatter('%(levelname)s %(message)s')
    default_handler.setFormatter(sd_formatter)

    app.logger.debug('Logging configured for stackdriver.')
