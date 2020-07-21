# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:lts-alpine
ARG SERVICE_DIR=.
RUN apk add --update-cache rsync # rsync for windows devs
ENV NODE_ENV development
RUN mkdir -p /service
WORKDIR /service

COPY ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     /service/
RUN npm install --loglevel warn
EXPOSE 8080
CMD eval $DC_COMMAND; npm install; npm run start
