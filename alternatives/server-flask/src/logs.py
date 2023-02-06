import logging
import sys

from pythonjsonlogger import jsonlogger

from src.config import get_config

config = get_config()


class StackdriverJsonFormatter(jsonlogger.JsonFormatter):
    def process_log_record(self, log_record):
        # Stackdriver severity levels map one-to-one with python
        # loglevels: DEBUG, INFO, WARNING, ERROR, CRITICAL
        log_record["severity"] = log_record["levelname"]
        del log_record["levelname"]

        log_record["labels"] = {
            "project": config["COMMON_PROJECT"],
            "company": config["COMMON_COMPANY"],
            "family": config["COMMON_FAMILY"],
            "application": config["COMMON_APPLICATION"],
            "suffix": config["COMMON_SUFFIX"],
            "domain": config["COMMON_DOMAIN"],
            "imageTag": config["COMMON_IMAGE_TAG"],
            "env": config["COMMON_ENV"],
        }

        if "exc_info" in log_record:
            # Try to extract error id for logging.
            # Take the exception instance from sys.exc_info,
            # because the exc_info in log_record contains only
            # the traceback.
            err = sys.exc_info()[1]  # (type, instance, traceback)
            err_id = getattr(err, "log_id", None)
            log_record["err"] = {
                "id": err_id,
                "message": log_record["exc_info"],
            }
            del log_record["exc_info"]

        return super().process_log_record(log_record)


def setup_logging(config: dict) -> None:
    log_config = {
        "force": True,
        "level": config["COMMON_LOG_LEVEL"].upper(),
    }

    if config["COMMON_LOG_FORMAT"] == "stackdriver":
        sd_formatter = StackdriverJsonFormatter("%(levelname)s %(message)s")
        sd_handler = logging.StreamHandler()
        sd_handler.setFormatter(sd_formatter)
        log_config["handlers"] = [sd_handler]

    logging.basicConfig(**log_config)
