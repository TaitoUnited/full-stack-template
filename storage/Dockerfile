# Builder, tester and runtime container for local development
FROM minio/minio:latest
ARG SERVICE_DIR=.
WORKDIR /service
COPY ${SERVICE_DIR} /service
CMD server /service
