# Builder, tester and runtime container for local development
FROM node:8.7-alpine
ENV NODE_ENV development
RUN apk add --update-cache build-base python git fontconfig
# Required by the current flow version (can be removed later?)
RUN apk --no-cache add ca-certificates wget && \
  wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
  wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.27-r0/glibc-2.27-r0.apk && \
  apk add glibc-2.27-r0.apk
WORKDIR /server
RUN npm install nodemon -g
COPY ./package.json /server/package.json
COPY ./package-lock.json /server/package-lock.json
COPY ./.flowconfig /server/.flowconfig
RUN npm install --loglevel warn
RUN npm run types-install
COPY . /server
EXPOSE 3332
CMD npm install; npm run types-install; npm run start
