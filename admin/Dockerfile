# TODO: use multi-stage dockerfile also locally?
FROM node:8.7-alpine
ENV NODE_ENV development
RUN apk add --update-cache build-base python git
WORKDIR /admin
COPY ./package.json /admin/package.json
RUN npm install --loglevel warn
COPY . /admin
EXPOSE 3334
CMD ["npm", "run", "start"]
