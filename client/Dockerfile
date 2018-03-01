# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
ENV NODE_ENV development
RUN apk add --update-cache build-base python git
# Required by the current flow version (can be removed later?)
RUN apk --no-cache add ca-certificates wget && \
  wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
  wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.27-r0/glibc-2.27-r0.apk && \
  apk add glibc-2.27-r0.apk
WORKDIR /client
COPY ./package.json /client/package.json
COPY ./package-lock.json /client/package-lock.json
RUN npm install --loglevel warn
RUN npm run flow-install
COPY . /client
EXPOSE 3333
CMD ["npm", "run", "start"]
