

import logging
import sys
import typing
import os
from time import time
import json_log_formatter
from collections import defaultdict

_config = defaultdict(
    lambda: None,  # type: ignore
    os.environ,
    )

class CustomisedJSONFormatter(json_log_formatter.JSONFormatter):
    def json_record(self, message: str, extra: dict, record: logging.LogRecord) -> dict:
        print('EXTRA', extra)
        print('REC', record)
        # # Stackdriver severity levels map one-to-one with python
        # # loglevels: DEBUG, INFO, WARNING, ERROR, CRITICAL
        # extra['severity'] = record['levelname']
        # del record['levelname']

        extra['labels'] = {
            'project': _config['COMMON_PROJECT'],
            'company': _config['COMMON_COMPANY'],
            'family': _config['COMMON_FAMILY'],
            'application': _config['COMMON_APPLICATION'],
            'suffix': _config['COMMON_SUFFIX'],
            'domain': _config['COMMON_DOMAIN'],
            'imageTag': _config['COMMON_IMAGE_TAG'],
            'env': _config['COMMON_ENV'],
        }

        # if 'exc_info' in record:
        #     # Try to extract error id for logging.
        #     # Take the exception instance from sys.exc_info,
        #     # because the exc_info in record contains only
        #     # the traceback.
        #     err = sys.exc_info()[1]  # (type, instance, traceback)
        #     err_id = getattr(err, 'log_id', None)
        #     extra['err'] = {
        #         'id': err_id,
        #         'message': extra['exc_info'],
        #     }

        # if has_request_context():
        #     latency = (time() - g.request_start) * 1000
        #     extra['requestMs'] = int(latency)
        #     extra['req'] = {
        #         'method': request.method,
        #         'url': request.url,
        #         'headers': {
        #             k: v
        #             for k, v in request.headers.items()
        #             if k.lower() in allowed_headers
        #         },
        #     }

        return extra
