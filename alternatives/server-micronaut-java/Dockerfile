# For local development
FROM adoptopenjdk/openjdk11-openj9:jdk-11.0.1.13-alpine-slim

RUN mkdir -p /develop
WORKDIR /develop

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR} /develop
# ENV GRADLE_OPTS "--project-cache-dir /.gradle"
RUN ./gradlew

EXPOSE 8080
# TODO: how to use secrets file in application.yml
CMD DATABASE_PASSWORD=$(cat /run/secrets/DATABASE_PASSWORD) ./gradlew run
