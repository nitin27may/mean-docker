# Create image based off of the official node:18.9.0-alpine3.16
FROM node:21-alpine

WORKDIR /api

RUN chown -R node:node /api

# Copy dependency definitions
COPY --chown=node:node package*.json .

RUN npm i

RUN chmod -R 777 node_modules

RUN npm install -g nodemon

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD [ "npm", "run", "dev-server" ]
