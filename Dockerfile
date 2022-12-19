FROM node:14.18.3-alpine

RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY ./src /usr/src/app/src
COPY ./.env /usr/src/app/

USER node
EXPOSE 8000

CMD ["npm", "start"]
