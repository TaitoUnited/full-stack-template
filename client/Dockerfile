FROM node:8.5-alpine

RUN apk add --update-cache build-base python git

WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install --loglevel warn

COPY . /app

EXPOSE 3333

CMD ["npm", "run", "start"]
