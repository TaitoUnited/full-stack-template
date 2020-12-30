# Builder, tester and runtime container for local development
FROM python:3.8-alpine
ENV NODE_ENV development
ENV DJANGO_ENV development
ENV DJANGO_APP src
ENV PYTHONPATH /usr/local/lib/python3.8/site-packages

RUN apk add --update-cache \
  g++ \
  libffi-dev \
  postgresql-dev \
  python3-dev

RUN mkdir -p /service
WORKDIR /service

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/requirements-dev.txt \
     ${SERVICE_DIR}/src/manage.py \
     /service/
RUN pip3 install --upgrade pip && pip3 install -r requirements-dev.txt

EXPOSE 8080
CMD python3.8 src/manage.py runserver 0.0.0.0:9229
# For debugging:
# ENTRYPOINT [ "tail", "-f", "/dev/null" ]

