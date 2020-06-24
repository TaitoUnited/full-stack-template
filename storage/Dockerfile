# Builder, tester and runtime container for local development
FROM minio/minio:RELEASE.2020-05-29T14-08-49Z
ARG SERVICE_DIR=.
RUN mkdir -p /service
WORKDIR /service
COPY ${SERVICE_DIR} /service
CMD server /service
