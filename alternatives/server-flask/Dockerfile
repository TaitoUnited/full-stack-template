FROM python:3.10-slim AS base

# version is useful for e.g. Sentry release
ARG CI_PIPELINE_ID \
    USER_ID
ENV CI_PIPELINE_ID="${CI_PIPELINE_ID}" \
    USER_ID="${USER_UID}" \
    PROJECT_PATH="/develop" \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/venv" \
    POETRY_HOME="/opt/poetry" \
    POETRY_NO_INTERACTION=1

ENV PATH="$VENV_PATH/bin:$POETRY_HOME/bin:$PATH"

RUN apt-get update && apt-get upgrade -y \
    && apt-get install curl -y \
    && curl -sSL https://install.python-poetry.org | python - \
    && poetry --version

FROM base AS builder

# libssl-dev is required to build uWSGI with SSL-support
# to handle websocket handshakes correctly.
# PCRE is required for configuring uWSGI internal logging
# to disable health check request logs.
RUN apt-get update && apt-get upgrade -y \
    && apt-get install gcc git libssl-dev libpcre3 libpcre3-dev -y

RUN python -m venv $VENV_PATH

WORKDIR $PYSETUP_PATH

COPY ./poetry.lock ./pyproject.toml $PYSETUP_PATH/

RUN . $VENV_PATH/bin/activate && poetry install

FROM base

COPY --from=builder $VENV_PATH $VENV_PATH
COPY --from=builder $PYSETUP_PATH $PYSETUP_PATH

WORKDIR $PROJECT_PATH
COPY . $PROJECT_PATH

ARG USER_UID
ENV USER_UID="${USER_UID}"

# RUN chown -R ${USER_UID}:${USER_UID} $PROJECT_PATH/src

CMD ["watchmedo", "auto-restart", \
        "--directory=/develop", \
        "--recursive", \
        "--pattern=*.py", \
        "--", \
        "uwsgi", "--ini", "uwsgi.ini" \
    ]
