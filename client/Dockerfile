# Builder, tester and runtime container for local development
ARG BUILDER_IMAGE='node:22.12.0-bookworm-slim'

FROM ${BUILDER_IMAGE}

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN useradd --system --uid "${USER_UID}" --gid 0 -m developer || :
RUN mkdir -p /develop && chown "${USER_UID}:0" /develop
WORKDIR /develop
USER "${USER_UID}"

ARG SERVICE_DIR=.
COPY --chown="${USER_UID}:0" \
     ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     ${SERVICE_DIR}/.npmrc \
     /develop/

ENV NODE_ENV development
RUN npm install --loglevel warn
RUN mkdir -p .vite

ENV DEV_PORT 8080
ENV DEV_BINDADDR 0.0.0.0
EXPOSE 8080
CMD npm install; rm -rf .vite/*; npm run generate; npm run start
