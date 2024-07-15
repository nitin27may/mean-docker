# Frontend (Angular)

Frontend for application using Angular (updated to 18.1.0)

## Development server

Run `npm start` for a dev server. It will open `http://localhost:4200/` in your default browser. The app will automatically reload if you change any of the source files.

Or you can run `npm run dev-server`. It will start frontend and api together. Open  `http://localhost:4200/` to access application.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. Also, we have enabled SSR (Server side rendering) for fast first loading of UI on production.

## Next Todo

Next development

* [x] Add Bootstrap
* [x] Add Header and Side Menu, Profile page
* [x] Implement Login and add Interceptor to attach token in each request
* [x] Add CRUD example
* [x] Add A Grid
* [x] Add Proxy Configuration for local develolpment
* [x] Server Side Rendering
* [x] Reusable validation module
* [x] Core and Shared Module
* [x] Docker Support
* [ ] Add Service Worker

## Build with

Describes which version .

| Name       | Version  |
| ---------- | -------- |
| bootstrap     | v5.3.2    |
| @ng-bootstrap | v17.0.0 |


### Dockerfile Production

```dockerfile
# Create image based off of the official Node 10 image
FROM node:21-alpine as builder

# Copy dependency definitions
COPY package.json package-lock.json ./

RUN npm install -g npm@9.1.2

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
## --legacy-peer-deps as ngx-bootstrap still depends on Angular 14
RUN npm i --legacy-peer-deps && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Build server side bundles
RUN npm run build:ssr

FROM node:21-alpine
## From 'builder' copy published folder
COPY --from=builder /app /app

WORKDIR /app
# Expose the port the app runs in
EXPOSE 4000

USER node

CMD ["node", "dist/frontend/server/main.js"]

```
### Dockerfile Development mode
```dockerfile

# Create image based off of the official 12.8-alpine
FROM node:21-alpine

#RUN echo "nameserver 8.8.8.8" |  tee /etc/resolv.conf > /dev/null
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i --legacy-peer-deps --unsafe-perm=true --allow-root

RUN npm install -g @angular/cli

COPY . /app/

EXPOSE 4200 49153
```
