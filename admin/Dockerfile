# Builder, tester and runtime container for local development
# NOTE: Use the same cypress version both in Dockerfile and package.json to
#       avoid unnecessary cypress download
FROM taitounited/cypress:4.9.0
ARG SERVICE_DIR=.
RUN apt-get -y update && apt-get -y install rsync # rsync for windows devs
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
ENV API_ROOT ''
ENV API_URL /api
RUN npm install --loglevel warn
EXPOSE 8080
CMD eval $DC_COMMAND; (cd shared && npm install); npm install; npm run start
