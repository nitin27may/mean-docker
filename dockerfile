### STAGE 1: Build ###
# We label our stage as ‘builder’
FROM node:20-alpine as builder

COPY frontend/package.json frontend/package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY /frontend .

## Change apiEndpoint in environment.ts
RUN sh -c "sed -i 's|http://localhost:3000/api|/api|' src/environments/environment.ts"

## Change production to true in environment.ts
RUN sh -c "sed -i 's|production: false|production: true|' src/environments/environment.ts"

ARG BASE_HREF=/

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build:prod

## Change base href in index.html
RUN sh -c "find . -name \"index*.html\" -exec sed -i 's|<base href=\"/\">|<base href=\"${BASE_HREF}\">|' {} +"

### STAGE 2: Setup ###
FROM node:20-alpine

## channge directory
WORKDIR /app

#COPY api code to app folder
COPY /api/ /app/

RUN npm ci

## From ‘builder’ copy published angular bundles in app/public
COPY --from=builder /app/dist/contacts/browser /app/public

## expose port for express
EXPOSE 3000

CMD ["node",  "server.js"]