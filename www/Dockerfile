ARG BUILDER_IMAGE='node:20.9.0-alpine'

FROM ${BUILDER_IMAGE}
CMD echo "DISABLED: www not up-to-date" && tail -f /dev/null

# # Builder, tester and runtime container for local development
# FROM node:lts-buster-slim
# ARG SERVICE_DIR=.
# ENV NODE_ENV development

# # Init /develop for user USER_UID
# ARG USER_UID=1001
# RUN useradd --system --uid "${USER_UID}" --gid 0 -m developer || :
# RUN mkdir -p /develop && \
#      chown "${USER_UID}:0" /develop
# WORKDIR /develop

# # Install dependencies and npm libraries on container
# COPY --chown="${USER_UID}:0" \
#      ${SERVICE_DIR}/install.sh \
#      ${SERVICE_DIR}/package* \
#      ${SERVICE_DIR}/.npmrc \
#      /develop/
# RUN ./install.sh
# USER "${USER_UID}"
# RUN npm install --loglevel warn

# # Install site npm libraries on container to speed up builds
# COPY --chown="${USER_UID}:0" \
#      ${SERVICE_DIR}/hooks.json \
#      ${SERVICE_DIR}/**/package* \
#      /develop/site/
# RUN npm run install-site

# # Start development
# EXPOSE 8080
# CMD . ~/.bashrc && ./develop.sh
