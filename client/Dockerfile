# Builder, tester and runtime container for local development
# NOTE: Use the same cypress version both in Dockerfile and package.json to
#       avoid unnecessary cypress download
FROM taitounited/cypress:7.2.0

RUN mkdir -p /develop
WORKDIR /develop

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     /develop/

ENV NODE_ENV development
RUN npm install --loglevel warn

ENV DEV_PORT 8080
# Expose 8081 for webpack lazy compilation's http server
EXPOSE 8080 8081
CMD npm install; npm run start
