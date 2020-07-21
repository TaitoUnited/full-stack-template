# For local development
FROM adoptopenjdk/openjdk11-openj9:jdk-11.0.1.13-alpine-slim
RUN apk add --update-cache rsync # rsync for windows devs

RUN mkdir -p /service
WORKDIR /service

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR} /service
# ENV GRADLE_OPTS "--project-cache-dir /.gradle"
RUN ./gradlew

EXPOSE 8080
# TODO: how to use secrets file in application.yml
CMD eval $DC_COMMAND; DATABASE_PASSWORD=$(cat /run/secrets/DATABASE_PASSWORD) ./gradlew run
