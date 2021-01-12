# Builder, tester and runtime container for local development
FROM python:3.9-alpine
ENV PYTHONPATH /usr/local/lib/python3.9/site-packages
ENV NODE_ENV development
ENV DJANGO_ENV development
ENV DJANGO_APP src

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
RUN pip3 install -r requirements-dev.txt

EXPOSE 8080
CMD sleep 2; python3 src/manage.py runserver 0.0.0.0:8080
