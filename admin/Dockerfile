# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
RUN apk add --update-cache build-base python git
# Required by the current flow version (can be removed later?)
RUN apk --no-cache add ca-certificates wget && \
  wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
  wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.27-r0/glibc-2.27-r0.apk && \
  apk add glibc-2.27-r0.apk
WORKDIR /admin
COPY ./package.json ./package-lock.* ./.flowconfi* /admin/
ENV NODE_ENV development
RUN npm install --loglevel warn
RUN npm run types-install
COPY . /admin
EXPOSE 3334
CMD npm install; npm run types-install; npm run start
