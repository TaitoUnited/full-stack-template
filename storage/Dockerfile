# Builder, tester and runtime container for local development
FROM minio/minio
ARG SERVICE_DIR=.
RUN mkdir -p /service
WORKDIR /service
COPY ${SERVICE_DIR} /service
CMD server /service
