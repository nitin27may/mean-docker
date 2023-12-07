# Create image based off of the official node:18.9.0-alpine3.16
FROM node:21-alpine

WORKDIR /api

COPY package*.json ./

RUN npm i --legacy-peer-deps --unsafe-perm=true --allow-root

COPY . /api/
# Expose the port the app runs in
EXPOSE 3000 9229


