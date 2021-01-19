# Frontend (Angular)

Frontend for application using Angular (updated to 11.0.9)

## Development server

Run `npm start` for a dev server. It will open `http://localhost:4200/` in your default browser. The app will automatically reload if you change any of the source files.

Or you can run `npm run dev-server`. It will start frontend and api together. Open  `http://localhost:4200/` to access application.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. Also, we have enabled SSR (Server side rendering) for fast first loading of UI on production.

### Dockerfile Production

```dockerfile
# Create image based off of the official Node 10 image
FROM node:14.5-alpine as builder

# Copy dependency definitions
COPY package.json package-lock.json ./

# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false

## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm ci && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Build server side bundles
RUN npm run build:ssr

FROM node:14.5-alpine
## From 'builder' copy published folder
COPY --from=builder /app/dist/frontend /app

WORKDIR /app
# Expose the port the app runs in
EXPOSE 4000

CMD ["node", "server/main.js"]

```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
