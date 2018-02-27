# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
ENV NODE_ENV development
RUN apk add --update-cache build-base python git fontconfig
WORKDIR /server
COPY . /server
RUN npm install nodemon -g
RUN npm install --loglevel warn
# NOTE: postinstall fails in previous step because of root user so we run it manually
RUN npm run postinstall
EXPOSE 3332
CMD ["npm", "run", "start"]
