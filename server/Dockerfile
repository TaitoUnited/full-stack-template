# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:lts-alpine

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN adduser -u "${USER_UID}" -G root -S developer || :
RUN mkdir -p /develop && \
     chown "${USER_UID}:0" /develop
WORKDIR /develop
USER "${USER_UID}"

ARG SERVICE_DIR=.
COPY --chown="${USER_UID}:0" \
     ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     /develop/

ENV NODE_ENV development
RUN npm install --loglevel warn

EXPOSE 8080
CMD npm install; npm run start
