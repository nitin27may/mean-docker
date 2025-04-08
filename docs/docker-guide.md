---
layout: default
title: Docker Guide
nav_order: 3
---

# Docker Guide
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Overview

This guide explains the Docker configuration for the MEAN Stack Contacts application, including individual Dockerfiles for each service and the docker-compose files for orchestration.

## Individual Dockerfiles

### Frontend Dockerfile

The Angular frontend uses a multi-stage build process to create a small, optimized production image:

```dockerfile
# filepath: /Users/nks/workspace/personal/public/mean-docker/frontend/Dockerfile

# Create image based off of the official Node 22-alpine image
FROM node:22-alpine as builder
# Copy dependency definitions
COPY package.json package-lock.json ./
## installing and Storing node modules on a separate layer will prevent unnecessary npm installs at each build
## --legacy-peer-deps as ngx-bootstrap still depends on Angular 14
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
# Build server side bundles
RUN npm run build
FROM node:22-alpine
## From 'builder' copy published folder
COPY --from=builder /app /app
WORKDIR /app
# Expose the port the app runs in
EXPOSE 4000
USER node
CMD ["node", "dist/contacts/server/server.mjs"]
```

**Key Features:**
- **Multi-stage build**: Reduces final image size by using a separate build stage
- **Dependency caching**: Optimizes build time by leveraging Docker layer caching
- **Dynamic API endpoint**: Configurable via build argument, allowing the same Dockerfile to work with different deployment strategies
- **Non-root user**: Runs as the `node` user for better security

### API Dockerfile

The Express.js API Dockerfile:

```dockerfile
# filepath: /Users/nks/workspace/personal/public/mean-docker/api/Dockerfile

FROM node:22-alpine
# Create directory for application
WORKDIR /app
# Install app dependencies by copying package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Bundle app source
COPY . .
# Build TypeScript to JavaScript
RUN npm run build
# Expose port for API
EXPOSE 3000
# Set non-root user for security
USER node
# Start the application
CMD ["node", "dist/server.js"]
```

**Key Features:**
- **Alpine-based**: Minimal image size for faster deployments
- **TypeScript build**: Compiles TypeScript to JavaScript during image creation
- **Security-focused**: Runs as non-root user

### Load Balancer (Nginx) Dockerfile

The Nginx load balancer Dockerfile:

```dockerfile
# filepath: /Users/nks/workspace/personal/public/mean-docker/loadbalancer/Dockerfile

FROM nginx:alpine
# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom configuration
COPY nginx.conf /etc/nginx/conf.d/
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Key Features:**
- **Alpine-based**: Minimal footprint for the load balancer
- **Custom configuration**: Uses our custom Nginx configuration for routing
- **Simple setup**: Minimal complexity for the proxy layer

## Docker Compose Files

### Standard Docker Compose (docker-compose.yml)

This configuration runs the application with direct API access (no Nginx):

```yaml
version: '3'
services:
  database:
    image: mongo:7.0
    container_name: mongo
    restart: always
    volumes:
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/
      - ./data/db:/data/db
    networks:
      - mean-network
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin-user
      - MONGO_INITDB_ROOT_PASSWORD=admin-password
      - MONGO_INITDB_DATABASE=mean-contacts

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    image: mean-api
    container_name: mean-api
    restart: always
    volumes:
      - ./api:/app
      - /app/node_modules 
    networks:
      - mean-network
    ports:
      - "3000:3000"
    depends_on:
      - database
    environment:
      - PORT=3000
      - SECRET=Thisismysecret
      - MONGO_DB_USERNAME=admin-user
      - MONGO_DB_PASSWORD=admin-password
      - MONGO_DB_HOST=database
      - MONGO_DB_PORT=
      - MONGO_DB_PARAMETERS=?authSource=admin
      - MONGO_DB_DATABASE=mean-contacts

  angular:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - API_URL=http://localhost:3000/api
    image: mean-ui
    container_name: mean-ui
    restart: always
    ports:
      - "4000:4000"
    networks:
      - mean-network
    depends_on:
      - api

networks:
  mean-network:
    driver: bridge
```

**Key Features:**
- **Three-service architecture**: Database, API, and Frontend
- **Network isolation**: Uses a dedicated bridge network for secure communication
- **API URL configuration**: Frontend directly accesses the API at a specific URL
- **Volume mapping**: Database persistence and development hot-reloading
- **Environment variables**: Used for service configuration and MongoDB credentials

### Nginx Docker Compose (docker-compose.nginx.yml)

This configuration adds Nginx as a reverse proxy for both the frontend and API:

```yaml
version: '3'
services:
  database:
    image: mongo:7.0
    container_name: mongo
    restart: always
    volumes:
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/
      - ./data/db:/data/db
    networks:
      - mean-network
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin-user
      - MONGO_INITDB_ROOT_PASSWORD=admin-password
      - MONGO_INITDB_DATABASE=mean-contacts

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    image: mean-api
    container_name: mean-api
    restart: always
    volumes:
      - ./api:/app
      - /app/node_modules
    networks:
      - mean-network
    environment:
      - PORT=3000
      - SECRET=Thisismysecret
      - MONGO_DB_USERNAME=admin-user
      - MONGO_DB_PASSWORD=admin-password
      - MONGO_DB_HOST=database
      - MONGO_DB_PORT=
      - MONGO_DB_PARAMETERS=?authSource=admin
      - MONGO_DB_DATABASE=mean-contacts

  angular:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - API_URL=/api
    image: mean-ui
    container_name: mean-ui
    restart: always
    networks:
      - mean-network
    depends_on:
      - api

  nginx:
    build:
      context: ./loadbalancer
      dockerfile: Dockerfile
    image: mean-nginx
    container_name: mean-nginx
    restart: always
    ports:
      - "80:80"
    networks:
      - mean-network
    depends_on:
      - angular
      - api

networks:
  mean-network:
    driver: bridge
```

**Key Features:**
- **Four-service architecture**: Adds Nginx as a reverse proxy/load balancer
- **Single entry point**: All traffic flows through Nginx on port 80
- **Simplified API URL**: Frontend uses a relative path `/api` that Nginx routes internally
- **No direct API exposure**: API service isn't directly exposed to the outside world
- **Enhanced security**: Internal services are isolated from direct external access

## Nginx Configuration

The Nginx configuration file used for routing:

```nginx
# filepath: /Users/nks/workspace/personal/public/mean-docker/loadbalancer/nginx.conf

server {
  listen 80;
  
  # Angular application
  location / {
    proxy_pass http://angular:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  
  # Express.js API
  location /api {
    proxy_pass http://api:3000/api;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

This configuration:
1. Listens on port 80
2. Routes all requests to `/` to the Angular application
3. Routes all requests to `/api` to the Express.js API
4. Maintains important headers for proper client IP forwarding

## Docker Hub Deployment

The project also includes a configuration for deploying using pre-built images from Docker Hub:

```yaml
# filepath: /Users/nks/workspace/personal/public/mean-docker/docker-compose.hub.yml

version: '3'
services:
  database:
    image: mongo:7.0
    container_name: mongo
    restart: always
    volumes:
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/
      - ./data/db:/data/db
    networks:
      - mean-network
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin-user
      - MONGO_INITDB_ROOT_PASSWORD=admin-password
      - MONGO_INITDB_DATABASE=mean-contacts

  api:
    image: nitin27may/mean-api:latest
    container_name: mean-api
    restart: always
    networks:
      - mean-network
    environment:
      - PORT=3000
      - SECRET=Thisismysecret
      - MONGO_DB_USERNAME=admin-user
      - MONGO_DB_PASSWORD=admin-password
      - MONGO_DB_HOST=database
      - MONGO_DB_PORT=
      - MONGO_DB_PARAMETERS=?authSource=admin
      - MONGO_DB_DATABASE=mean-contacts

  angular:
    image: nitin27may/mean-ui:latest
    container_name: mean-ui
    restart: always
    networks:
      - mean-network
    depends_on:
      - api

  nginx:
    image: nitin27may/mean-nginx:latest
    container_name: mean-nginx
    restart: always
    ports:
      - "80:80"
    networks:
      - mean-network
    depends_on:
      - angular
      - api

networks:
  mean-network:
    driver: bridge
```

This file uses pre-built images from Docker Hub, making deployment faster as it skips the build process.

## Best Practices Used

The Docker setup follows these best practices:

1. **Multi-stage builds** for smaller final images
2. **Non-root users** for enhanced security
3. **Layer caching** for faster builds
4. **Environment variables** for configuration
5. **Volume mounts** for persistence and development
6. **Network isolation** with dedicated bridge networks
7. **Parameterized builds** with build arguments
8. **Minimal base images** with Alpine variants

## Common Docker Commands

### Building and Starting the Application

```bash
# With Nginx (recommended)
docker-compose -f docker-compose.nginx.yml up -d

# Without Nginx
docker-compose up -d

# Using pre-built images
docker-compose -f docker-compose.hub.yml up -d
```

### Viewing Logs

```bash
# All containers
docker-compose -f docker-compose.nginx.yml logs -f

# Specific container
docker-compose -f docker-compose.nginx.yml logs -f api
```

### Stopping the Application

```bash
docker-compose -f docker-compose.nginx.yml down
```

### Rebuilding Containers

```bash
docker-compose -f docker-compose.nginx.yml build
docker-compose -f docker-compose.nginx.yml up -d
```

## Troubleshooting

### Container Won't Start

Check the logs for errors:
```bash
docker-compose -f docker-compose.nginx.yml logs <service-name>
```

### Can't Connect to MongoDB

Ensure the MongoDB container is running and the connection string is correct:
```bash
docker exec -it mongo mongosh -u admin-user -p admin-password --authenticationDatabase admin
```

### Frontend Cannot Reach API

In the Nginx setup, verify:
1. Nginx configuration is correct
2. Angular environment is using the correct API URL ('/api')
3. API service is running

### Slow Build Times

Use BuildKit for faster builds:
```bash
DOCKER_BUILDKIT=1 docker-compose -f docker-compose.nginx.yml build
```

## Conclusion

This Docker setup provides a flexible, scalable approach to deploying the MEAN Stack application. The Nginx configuration offers a production-ready deployment with a single entry point, while the standard docker-compose file is useful for development and debugging.
