# Stage 1: Build the Angular application
FROM node:22-alpine AS builder

# Copy dependency definitions
COPY package.json package-lock.json ./

## Installing and storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install --legacy-peer-deps && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Define build argument with default value (for direct API access)
ARG API_URL="/api"

RUN echo "Replacing API endpoint with: $API_URL"
RUN sed -i "s|apiEndpoint: '[^']*'|apiEndpoint: '$API_URL'|g" src/environments/environment.ts
RUN cat src/environments/environment.ts

# Build the Angular app (browser-only, no SSR)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app to nginx html directory
COPY --from=builder /app/dist/contacts/browser /usr/share/nginx/html

# Expose port 4000 to match previous configuration
EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
