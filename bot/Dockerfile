# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
RUN apk add --update-cache build-base python git fontconfig
WORKDIR /bot
ENV NODE_ENV development
RUN npm install nodemon -g
COPY ./package.json ./package-lock.* ./.flowconfi* /bot/
RUN npm install --loglevel warn
RUN npm run types-install
COPY . /bot
EXPOSE 3332
CMD npm install; npm run types-install; npm run start
