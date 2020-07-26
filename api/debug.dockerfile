# Create image based off of the official 12.8-alpine
FROM node:14

# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false

# Change directory so that our commands run inside this new directory
WORKDIR /api

# Copy dependency definitions
COPY package.json ./

## installing node modules
RUN npm i

COPY . .

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD [ "npm", "run", "dev-server" ]
