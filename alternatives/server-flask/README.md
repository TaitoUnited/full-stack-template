# full-stack-template | alternative server flask+uwsgi

## Pip packages

Pip packages are managed with pip-tools by running `pip-compile requirements-[dev/prod].in` which outputs `requirements-[dev/prod].txt` with specific package versions including dependencies.

* requirements.in
  *  Common packages for dev and prod.
* requirements-dev.in
  * Packages for local environment: flake8, mypy, pytest...
* requirements-prod.in
  * Packages for non-local environment: sentry, stackdriver, uwsgi...
