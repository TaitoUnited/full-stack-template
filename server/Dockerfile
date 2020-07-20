# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:lts-alpine
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

COPY ${SERVICE_DIR}/package.json \
  ${SERVICE_DIR}/package-lock.* \
  /service/
ENV BASE_PATH /api
RUN npm install --loglevel warn
EXPOSE 8080
CMD eval $DC_COMMAND; (cd shared && npm install); npm install; npm run start
