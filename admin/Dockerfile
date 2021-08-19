# Builder, tester and runtime container for local development
# NOTE: Use the same cypress version both in Dockerfile and package.json to
#       avoid unnecessary cypress download
FROM ghcr.io/taitounited/cypress:8.3.0

RUN mkdir -p /develop
WORKDIR /develop

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     /develop/

ENV NODE_ENV development
RUN npm install --loglevel warn

ENV DEV_PORT 8080
EXPOSE 8080
CMD npm install; npm run start
