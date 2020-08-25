# Builder, tester and runtime container for local development
FROM node:lts-buster-slim

RUN mkdir -p /service
WORKDIR /service

# Install dependencies and npm libraries on container
ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/install.sh \
     ${SERVICE_DIR}/package* \
     /service/

ENV NODE_ENV development
RUN ./install.sh
RUN npm install --loglevel warn

# Install site npm libraries on container to speed up builds
COPY ${SERVICE_DIR}/hooks.json \
     ${SERVICE_DIR}/site/package* \
     /service/site/
RUN npm run install-site

# Start development
ENV DEV_PORT 8080
EXPOSE 8080
CMD . ~/.bashrc && ./develop.sh
