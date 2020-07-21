# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:lts-alpine
RUN apk add --update-cache rsync # rsync for windows devs

RUN mkdir -p /service
WORKDIR /service

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     /service/

ENV NODE_ENV development
RUN npm install --loglevel warn

EXPOSE 8080
CMD eval $DC_COMMAND; npm install; npm run start
