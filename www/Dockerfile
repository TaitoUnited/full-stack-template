# Builder, tester and runtime container for local development
FROM node:lts-buster-slim
ARG SERVICE_DIR=.
ENV NODE_ENV development

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN useradd --system --uid "${USER_UID}" --gid 0 -m developer || :
RUN mkdir -p /develop && \
     chown "${USER_UID}:0" /develop
WORKDIR /develop

# Install dependencies and npm libraries on container
COPY --chown="${USER_UID}:0" \
     ${SERVICE_DIR}/install.sh \
     ${SERVICE_DIR}/package* \
     /develop/
RUN ./install.sh
USER "${USER_UID}"
RUN npm install --loglevel warn

# Install site npm libraries on container to speed up builds
COPY --chown="${USER_UID}:0" \
     ${SERVICE_DIR}/hooks.json \
     ${SERVICE_DIR}/**/package* \
     /develop/site/
RUN npm run install-site

# Start development
EXPOSE 8080
CMD . ~/.bashrc && ./develop.sh
