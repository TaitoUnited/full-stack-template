FROM mhart/alpine-node:latest

RUN apk add --update-cache build-base python git

WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install

COPY . /app

EXPOSE 3333

CMD ["npm", "run", "start"]
