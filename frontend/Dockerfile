# Create image based off of the official Node 10 image
FROM node:21-alpine as builder

# Copy dependency definitions
COPY package.json package-lock.json ./

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
## --legacy-peer-deps as ngx-bootstrap still depends on Angular 14
RUN npm i && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Build server side bundles
RUN npm run build

FROM node:21-alpine
## From 'builder' copy published folder
COPY --from=builder /app /app

WORKDIR /app
# Expose the port the app runs in
EXPOSE 4000

USER node

CMD ["node", "dist/contacts/server/server.mjs"]
