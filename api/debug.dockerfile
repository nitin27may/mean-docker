# Create image based off of the official 12.8-alpine
FROM node:12.8-alpine

# disabling ssl for npm for Dev or if you are behind proxy
RUN echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf > /dev/null

## installing nodemon globally
RUN npm install -g nodemon

# Copy dependency definitions
COPY package.json package-lock.json ./

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /api && mv ./node_modules ./api

# Change directory so that our commands run inside this new directory
WORKDIR /api

COPY . /api/

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "run", "dev-server"]
