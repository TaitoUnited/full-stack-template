# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:lts-alpine

RUN mkdir -p /develop
WORKDIR /develop

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     /develop/

ENV NODE_ENV development
RUN npm install --loglevel warn

EXPOSE 8080
CMD npm install; npm run start
