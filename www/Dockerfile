# Builder, tester and runtime container for local development
# NOTE: Use the same cypress version both in Dockerfile and package.json to
#       avoid unnecessary cypress download
FROM taitounited/cypress:3.2.0-node10
ARG SERVICE_DIR=.
ENV NODE_ENV development

WORKDIR /service
COPY ${SERVICE_DIR}/install.sh \
     ${SERVICE_DIR}/package* \
     /service/
RUN . ./install.sh
RUN npm install --loglevel warn

# Install site npm libraries on container to speed up builds
COPY ${SERVICE_DIR}/hooks.json \
     ${SERVICE_DIR}/site/package* \
     /service/site/
RUN rm -f /service/site/hooks.json
RUN mkdir -p /build && \
    npm run install-site

# Start development
EXPOSE 8080
CMD . ~/.bashrc && ./develop.sh
