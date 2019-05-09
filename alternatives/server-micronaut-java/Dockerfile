# For local development
FROM adoptopenjdk/openjdk11-openj9:jdk-11.0.1.13-alpine-slim
ARG SERVICE_DIR=.
WORKDIR /service
COPY ${SERVICE_DIR} /service
# ENV GRADLE_OPTS "--project-cache-dir /.gradle"
RUN ./gradlew
EXPOSE 8080
# TODO: how to use secrets file in application.yml
CMD DATABASE_PASSWORD=$(cat /run/secrets/DATABASE_PASSWORD) ./gradlew run
