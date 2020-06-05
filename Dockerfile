FROM node:10-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add ffmpeg openssl \
    && apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp

COPY . /app

EXPOSE 3000

CMD [ "sh", "entrypoint.sh" ]
