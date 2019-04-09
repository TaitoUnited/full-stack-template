# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:10-alpine
ARG SERVICE_DIR=.
WORKDIR /service
ENV NODE_ENV development
COPY ${SERVICE_DIR}/package.json \
  ${SERVICE_DIR}/package-lock.* \
  /service/
RUN npm install --loglevel warn
EXPOSE 8080
CMD npm install; npm run start
