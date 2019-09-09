# Builder, tester and runtime container for local development
FROM python:3.7-alpine
ARG SERVICE_DIR=.
ENV FLASK_ENV development
ENV FLASK_APP blog

RUN apk add --update-cache \
  g++ \
  libffi-dev \
  postgresql-dev \
  python3-dev \
  rsync # rsync for windows devs

WORKDIR /service

COPY ${SERVICE_DIR}/requirements-dev.txt /service/
RUN pip3 install --upgrade pip && pip3 install -r requirements-dev.txt

EXPOSE 8080
CMD eval $DC_COMMAND; flask run --host $API_BINDADDR --port $API_PORT --no-debugger
