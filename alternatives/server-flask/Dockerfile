# Builder, tester and runtime container for local development
FROM python:3.9-alpine
ENV NODE_ENV development
ENV FLASK_ENV development
ENV FLASK_APP src

RUN apk add --update-cache \
  g++ \
  libffi-dev \
  postgresql-dev \
  python3-dev

RUN mkdir -p /develop
WORKDIR /develop

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/requirements-dev.txt /develop/
RUN pip3 install --upgrade pip pip-tools
RUN pip3 install -r requirements-dev.txt && pip3 install ptvsd

EXPOSE 8080
CMD python -m ptvsd --host 0.0.0.0 --port 9229 -m flask run --host $API_BINDADDR --port $API_PORT --no-debugger
