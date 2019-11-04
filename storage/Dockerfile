# Builder, tester and runtime container for local development
FROM minio/minio:RELEASE.2019-10-12T01-39-57Z
ARG SERVICE_DIR=.
WORKDIR /service
COPY ${SERVICE_DIR} /service
CMD server /service
