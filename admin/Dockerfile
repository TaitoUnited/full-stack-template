ARG BUILDER_IMAGE='node:20.9.0-alpine'

FROM ${BUILDER_IMAGE}
CMD echo "DISABLED: admin not up-to-date" && tail -f /dev/null

# # Builder, tester and runtime container for local development
# # NOTE: Use the same cypress version both in Dockerfile and package.json to
# #       avoid unnecessary cypress download
# FROM ghcr.io/taitounited/cypress:12.5.0

# # Init /develop for user USER_UID
# ARG USER_UID=1001
# RUN useradd --system --uid "${USER_UID}" --gid 0 -m developer || :
# RUN mkdir -p /develop && \
#      chown "${USER_UID}:0" /develop
# WORKDIR /develop
# USER "${USER_UID}"

# ARG SERVICE_DIR=.
# COPY --chown="${USER_UID}:0" \
#      ${SERVICE_DIR}/package.json \
#      ${SERVICE_DIR}/package-lock.* \
#      ${SERVICE_DIR}/.npmrc \
#      /develop/

# ENV NODE_ENV development
# RUN npm install --loglevel warn

# ENV DEV_PORT 8080
# EXPOSE 8080
# CMD npm install; npm run start
