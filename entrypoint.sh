#!/bin/sh

if [ ! -f cert/cert.pem ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -keyout cert/key.pem -out cert/cert.pem -subj "/C=BR/ST=BRETT/L=BRETT/O=BRETT/OU=BRETT/CN=BRETT/emailAddress=brett@example.com";
fi

npm run start
