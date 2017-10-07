FROM node:8.5-alpine

RUN apk add --update-cache build-base python git fontconfig

WORKDIR /app

ENV NODE_ENV dev

COPY ./package.json /app/package.json
RUN npm install nodemon -g
RUN npm install --loglevel warn

COPY . /app

EXPOSE 3332

CMD ["npm", "run", "start"]
