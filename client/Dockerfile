# Builder, tester and runtime container for local development

# ******************************** NOTE ***************************************
# Enable cypress and the browsers you want test against when you are ready
# to do e2e testing. Otherwise keep the ARGs commented out so that the browsers
# are not installed unnecessarily.

# Make sure you have the same cypress version specified in package.json!
# ARG CYPRESS_VERSION='12.16.0'

# Also keep in mind that the browser versions need to be exact versions!
# Check available versions here: https://github.com/cypress-io/cypress-docker-images/tree/master/factory#api
# ARG CHROME_VERSION='114.0.5735.198-1'
# ARG EDGE_VERSION='100.0.1185.29-1'
# ARG FIREFOX_VERSION='107.0'
# *****************************************************************************

# Node v20.9.0 has npm v9.6.5 (should match the version in package.json `engines` field!)
ARG NODE_VERSION='20.9.0'
# BASE_IMAGE arg is used by the 'cypress/factory' image
ARG BASE_IMAGE='node:20.9.0'
# Change BUILDER_IMAGE from 'node:x' to 'cypress/factory' when you are ready to do e2e testing
ARG BUILDER_IMAGE='node:20.9.0'

FROM ${BUILDER_IMAGE}

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
     ${SERVICE_DIR}/.npmrc \
     /develop/

ENV NODE_ENV development
RUN npm install --loglevel warn --no-audit
RUN mkdir -p .vite

ENV DEV_PORT 8080
ENV DEV_BINDADDR 0.0.0.0
EXPOSE 8080
CMD npm install; npm run start
