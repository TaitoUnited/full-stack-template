# Builder, tester and runtime container for local development
FROM python:3.9-alpine3.13
ENV NODE_ENV development
ENV DJANGO_ENV development
ENV DJANGO_APP src

RUN apk add --update-cache \
  g++ \
  libffi-dev \
  postgresql-dev \
  python3-dev

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN adduser -u "${USER_UID}" -G root -S developer || : 
RUN mkdir -p /develop && \
  chown "${USER_UID}:0" /develop
WORKDIR /develop
USER "${USER_UID}"

ARG SERVICE_DIR=.

COPY --chown="${USER_UID}:0" \
  ${SERVICE_DIR}/requirements-dev.txt /develop/
RUN pip3 install --upgrade pip pip-tools debugpy
RUN pip3 install -r requirements-dev.txt

EXPOSE 8080
CMD pip-compile requirements-dev.in; \
  pip-compile requirements-prod.in; \
  pip3 install -r requirements-dev.txt; \
  python -m debugpy --listen 0.0.0.0:9229 -m \
  src/manage.py runserver 0.0.0.0:8080
