# Builder, tester and runtime container for local development
FROM minio/minio
ARG SERVICE_DIR=.
RUN mkdir -p /develop
WORKDIR /develop
COPY ${SERVICE_DIR} /develop
CMD server /develop
