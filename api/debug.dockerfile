# Create image based off of the official node:18.9.0-alpine3.16
FROM node:18.9.0-alpine3.16

# Copy dependency definitions
COPY package.json package-lock.json ./


RUN npm ci && mkdir /api && mv ./node_modules ./api

# RUN npm ci

RUN npm install -g nodemon

COPY . /api/

WORKDIR /api

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD [ "npm", "run", "dev-server" ]
