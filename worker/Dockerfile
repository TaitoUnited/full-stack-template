# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
ENV NODE_ENV development
RUN apk add --update-cache build-base python git fontconfig
WORKDIR /worker
RUN npm install nodemon -g
COPY ./package.json /worker/package.json
COPY ./package-lock.json /worker/package-lock.json
COPY ./.flowconfig /worker/.flowconfig
RUN npm install --loglevel warn
RUN npm run flow-install
COPY . /worker
EXPOSE 3332
CMD ["npm", "run", "start"]
