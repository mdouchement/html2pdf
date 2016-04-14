FROM mhart/alpine-node:5.10
MAINTAINER Gregoire MORPAIN <gm@predicsis.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app/

EXPOSE 4005
CMD ["node", "index.js"]
