# Create image based off of the official 12.8-alpine
FROM node:14


# Change directory so that our commands run inside this new directory
WORKDIR /api

# Copy dependency definitions
COPY package.json package-lock.json ./

RUN npm ci

COPY . /api/

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD [ "npm", "run", "dev-server" ]
