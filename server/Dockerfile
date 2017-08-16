# TODO update node version
FROM nodesource/jessie:6.3.1

RUN apt-get update && apt-get install -y \
  build-essential \
  libfontconfig


WORKDIR /app

ENV NODE_ENV dev

COPY ./package.json /app/package.json
RUN npm install nodemon -g
RUN npm install

COPY . /app

EXPOSE 3332

CMD ["npm", "run", "start"]
