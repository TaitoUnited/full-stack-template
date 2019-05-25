# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:10-alpine
ARG SERVICE_DIR=.
RUN apk add --update-cache rsync # rsync for windows devs
WORKDIR /service
ENV NODE_ENV development
COPY ${SERVICE_DIR}/package.json \
  ${SERVICE_DIR}/package-lock.* \
  /service/
RUN npm install --loglevel warn
EXPOSE 8080
CMD eval $DC_COMMAND; npm install; npm run start
