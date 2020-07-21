# For local development
FROM adoptopenjdk/openjdk11-openj9:jdk-11.0.1.13-alpine-slim
ARG SERVICE_DIR=.
RUN apk add --update-cache rsync # rsync for windows devs
ENV NODE_ENV development
RUN mkdir -p /service
WORKDIR /service

COPY ${SERVICE_DIR} /service
# ENV GRADLE_OPTS "--project-cache-dir /.gradle"
RUN ./gradlew
EXPOSE 8080
# TODO: how to use secrets file in application.yml
CMD eval $DC_COMMAND; DATABASE_PASSWORD=$(cat /run/secrets/DATABASE_PASSWORD) ./gradlew run
