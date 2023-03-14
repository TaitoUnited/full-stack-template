# Builder, tester and runtime container for local development
FROM ghcr.io/taitounited/minio:20220401
ARG SERVICE_DIR=.
RUN mkdir -p /develop
WORKDIR /develop
COPY ${SERVICE_DIR} /develop
CMD server /develop
