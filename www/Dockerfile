# Builder, tester and runtime container for local development
FROM node:lts-buster-slim
ARG SERVICE_DIR=.
ENV NODE_ENV development

RUN mkdir -p /service
WORKDIR /service

# Install dependencies and npm libraries on container
COPY ${SERVICE_DIR}/install.sh \
     ${SERVICE_DIR}/package* \
     /service/
RUN ./install.sh
RUN npm install --loglevel warn

# Install site npm libraries on container to speed up builds
COPY ${SERVICE_DIR}/site/package* \
     /service/site/
RUN npm run install-site

# Start development
EXPOSE 8080
CMD eval $DC_COMMAND; . ~/.bashrc && ./develop.sh
