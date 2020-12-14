# Api (Expressjs) 

This project contains the api using expressjs

## Development server

Run `npm run dev-server` to start the api server in development mode (using nodemon).
### Dockerfile Production

```dockerfile
FROM node:12.8-alpine

# Copy dependency definitions
COPY package.json package-lock.json ./

# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false

## installing and Storing node modules on a separate layer will 
## prevent unnecessary npm installs at each build
RUN npm i && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]

```
### Dockerfile Development
```dockerfile
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

```
