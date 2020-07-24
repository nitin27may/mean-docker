### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:12.8-alpine as builder

COPY frontend/package.json frontend/package-lock.json ./

RUN npm set strict-ssl false
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY /frontend .

## Build the angular app in production mode and store the artifacts in dist folder

RUN npm run build -- --prod --output-path=dist


### STAGE 2: Setup ###

FROM node:12.8-alpine


## Copy our default nginx config
WORKDIR /app
#COPY nginx/default.conf /etc/nginx/conf.d/
COPY /api/ /app/

RUN npm set strict-ssl false

RUN npm ci

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /app/public
EXPOSE 3000
CMD ["node",  "server.js"]