# Builder, tester and runtime container for local development
FROM minio/minio:RELEASE.2019-03-27T22-35-21Z
ARG SERVICE_DIR=.
WORKDIR /service
COPY ${SERVICE_DIR} /service
CMD server /service
