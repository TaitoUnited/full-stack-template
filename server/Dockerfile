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
COPY . /server
RUN npm install nodemon -g
RUN npm install --loglevel warn
# NOTE: postinstall fails in previous step because of root user so we run it manually
RUN npm run postinstall
EXPOSE 3332
CMD ["npm", "run", "start"]
