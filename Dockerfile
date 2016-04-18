FROM mhart/alpine-node:5.10
MAINTAINER Gregoire MORPAIN <gm@predicsis.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN apk update && apk add git
RUN curl -Ls "https://github.com/dustinblackman/phantomized/releases/download/2.1.1/dockerized-phantomjs.tar.gz" | tar xz -C /
RUN npm install
COPY . /usr/src/app/

EXPOSE 4005
CMD ["npm", "start"]
