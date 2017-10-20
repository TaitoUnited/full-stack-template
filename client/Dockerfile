# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
ENV NODE_ENV development
RUN apk add --update-cache build-base python git
WORKDIR /client
COPY ./package.json /client/package.json
RUN npm install --loglevel warn
COPY . /client
EXPOSE 3333
CMD ["npm", "run", "start"]
