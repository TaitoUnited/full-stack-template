# Builder, tester and runtime container for local development
FROM node:lts-buster-slim
ARG SERVICE_DIR=.
ENV NODE_ENV development

RUN mkdir -p /develop
WORKDIR /develop

# Install dependencies and npm libraries on container
COPY ${SERVICE_DIR}/install.sh \
     ${SERVICE_DIR}/package* \
     /develop/
RUN ./install.sh
RUN npm install --loglevel warn

# Install site npm libraries on container to speed up builds
COPY ${SERVICE_DIR}/hooks.json \
     ${SERVICE_DIR}/site/package* \
     /develop/site/
RUN npm run install-site

# Start development
EXPOSE 8080
CMD . ~/.bashrc && ./develop.sh
