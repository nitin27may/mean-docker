# Create image based off of the official Node 10 image
FROM node:12.8-alpine

# Copy dependency definitions
COPY package.json package-lock.json ./


# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Build server side bundles
RUN npm run build:ssr

# Expose the port the app runs in
EXPOSE 4000
# Serve the app
CMD ["node", "dist/server"]
