# Builder, tester and runtime container for local development
# NOTE: npm libraries are installed inside container to speed up build
FROM node:10-alpine
ARG SERVICE_DIR=.
WORKDIR /service
COPY ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     ${SERVICE_DIR}/.flowconfi* \
     /service/
ENV NODE_ENV development
ENV API_ROOT ''
ENV API_URL /api
RUN npm install --loglevel warn
RUN npm run types-install
EXPOSE 8080
CMD npm install; npm run types-install; npm run start
