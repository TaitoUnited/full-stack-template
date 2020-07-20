# Builder, tester and runtime container for local development
FROM python:3.7-alpine
ARG SERVICE_DIR=.
ENV NODE_ENV development
ENV FLASK_ENV development
ENV FLASK_APP src

RUN apk add --update-cache \
  g++ \
  libffi-dev \
  postgresql-dev \
  python3-dev \
  rsync # rsync for windows devs

RUN mkdir -p /service
WORKDIR /service

RUN mkdir -p shared
COPY ${SERVICE_DIR}/shared/package.json \
     ${SERVICE_DIR}/shared/package-lock.* \
     /service/shared/
RUN (cd shared && npm install --loglevel warn)

COPY ${SERVICE_DIR}/requirements-dev.txt /service/
RUN pip3 install --upgrade pip && pip3 install -r requirements-dev.txt && pip3 install ptvsd

EXPOSE 8080
CMD eval $DC_COMMAND; python -m ptvsd --host 0.0.0.0 --port 9229 -m flask run --host $API_BINDADDR --port $API_PORT --no-debugger
