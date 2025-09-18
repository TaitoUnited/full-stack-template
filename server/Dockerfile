ARG BUILDER_IMAGE='node:22.12.0-bookworm-slim'

# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM ${BUILDER_IMAGE}

# Install deps
RUN apt-get update -y && apt-get install -y libxml2-utils

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
RUN npm install --no-audit --loglevel warn

EXPOSE 8080
CMD npm install --no-audit; npm run start
