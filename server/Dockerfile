# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
ENV NODE_ENV development
RUN apk add --update-cache build-base python git fontconfig
WORKDIR /server
COPY ./package.json /server/package.json
RUN npm install nodemon -g
RUN npm install --loglevel warn
COPY . /server
EXPOSE 3332
CMD ["npm", "run", "start"]
