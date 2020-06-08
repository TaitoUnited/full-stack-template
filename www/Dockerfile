# Builder, tester and runtime container for local development
FROM node:lts-buster-slim
ARG SERVICE_DIR=.
RUN apt-get -y update && apt-get -y install rsync # rsync for windows devs
ENV NODE_ENV development

RUN mkdir /service && chown node:node /service

WORKDIR /service
COPY ${SERVICE_DIR}/install.sh \
     ${SERVICE_DIR}/package* \
     /service/
RUN ./install.sh
RUN . ~/.bashrc && npm install --loglevel warn

# Install site npm libraries on container to speed up builds
COPY ${SERVICE_DIR}/hooks.json \
     ${SERVICE_DIR}/site/package* \
     /service/site/
RUN rm -f /service/site/hooks.json
RUN mkdir -p /build && \
    . ~/.bashrc && \
    npm run install-site

# Start development
EXPOSE 8080
CMD eval $DC_COMMAND; . ~/.bashrc && ./develop.sh
