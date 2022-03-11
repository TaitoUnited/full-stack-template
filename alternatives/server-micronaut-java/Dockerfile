# For local development
FROM adoptopenjdk/openjdk11-openj9:jdk-11.0.1.13-alpine-slim

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN adduser -u "${USER_UID}" -G root -S developer || : 
RUN mkdir -p /develop && \
    chown "${USER_UID}:0" /develop
WORKDIR /develop
USER "${USER_UID}"

ARG SERVICE_DIR=.
COPY --chown="${USER_UID}:0" \
    ${SERVICE_DIR} /develop
# ENV GRADLE_OPTS "--project-cache-dir /.gradle"
RUN ./gradlew

EXPOSE 8080
# TODO: how to use secrets file in application.yml
CMD DATABASE_PASSWORD=$(cat /run/secrets/DATABASE_PASSWORD) ./gradlew run
