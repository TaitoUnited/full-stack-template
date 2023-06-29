# Builder, tester and runtime container for local development

# NOTE: Enable cypress and the browsers you want test against only if you are
# doing e2e testing! Otherwise keep the ARGs commented out so that the browsers
# are not installed unnecessarily making the build faster.

# NOTE: the browser versions need to be exact versions!

# ARG CHROME_VERSION='107.0.5304.121-1'
# ARG EDGE_VERSION='100.0.1185.29-1'
# ARG FIREFOX_VERSION='107.0'
# ARG CYPRESS_VERSION='12.16.0'

# Node v18.16.0 has npm v9.6.5
ARG NODE_VERSION='18.16.0'
ARG BASE_IMAGE='node:18.16.0-alpine'

FROM cypress/factory

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN useradd --system --uid "${USER_UID}" --gid 0 -m developer || :
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
RUN mkdir -p .vite

ENV DEV_PORT 8080
ENV DEV_BINDADDR 0.0.0.0
EXPOSE 8080
CMD npm install; npm run start
