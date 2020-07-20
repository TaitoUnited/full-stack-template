# For local development
FROM adoptopenjdk/openjdk11-openj9:jdk-11.0.1.13-alpine-slim
ARG SERVICE_DIR=.
RUN apk add --update-cache rsync # rsync for windows devs
ENV NODE_ENV development
RUN mkdir -p /service
WORKDIR /service

RUN mkdir -p shared
COPY ${SERVICE_DIR}/shared/package.json \
     ${SERVICE_DIR}/shared/package-lock.* \
     /service/shared/
RUN (cd shared && npm install --loglevel warn)

COPY ${SERVICE_DIR} /service
# ENV GRADLE_OPTS "--project-cache-dir /.gradle"
RUN ./gradlew
EXPOSE 8080
# TODO: how to use secrets file in application.yml
CMD eval $DC_COMMAND; DATABASE_PASSWORD=$(cat /run/secrets/DATABASE_PASSWORD) ./gradlew run
