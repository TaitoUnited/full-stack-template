# full-stack-template | alternative server flask+uwsgi

## Pip packages

Pip packages are managed with pip-tools by running `pip-compile requirements-[dev/prod].in` which outputs `requirements-[dev/prod].txt` with specific package versions including dependencies.

* requirements.in
  * Common packages for dev and prod.
  * Contains `sentry-sdk[flask]` and `python-json-logger` for testing purposes (neither are really needed in local environment).
* requirements-dev.in
  * Packages for local environment: flake8, mypy, pytest...
* requirements-prod.in
  * Packages for non-local environment: sentry, stackdriver, uwsgi...

NOTE that some script is required to run the `pip-compile` inside the server container to ensure correct python and pip versions.
