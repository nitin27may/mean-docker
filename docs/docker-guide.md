---
layout: default
title: Docker Guide
nav_order: 2
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

The files in the repository are the source of truth. These are reproduced here
for reading; if they ever disagree, trust the repository.

### Frontend Dockerfile

[`frontend/Dockerfile`](https://github.com/nitin27may/mean-docker/blob/master/frontend/Dockerfile)
builds the Angular bundle and serves it with Nginx.

```dockerfile
# Stage 1: build the Angular application
FROM node:24-alpine AS builder

# corepack ships with Node and pins pnpm to the version in package.json, so the
# image does not depend on whatever pnpm happens to be latest at build time.
RUN corepack enable

WORKDIR /app

# Dependencies install from the lockfile on their own layer, so a source change
# does not reinstall them. --frozen-lockfile fails rather than silently
# resolving something new, which is what makes the build reproducible.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Which API origin the browser bundle talks to: "/api" behind the nginx load
# balancer, or an absolute URL when the API is published separately.
ARG API_URL="/api"
RUN sed -i "s|apiEndpoint: '[^']*'|apiEndpoint: '$API_URL'|g" src/environments/environment.ts

RUN pnpm run build

# Stage 2: serve the static bundle
FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/contacts/browser /usr/share/nginx/html

# Run as the image's unprivileged nginx user. Port 4000 is above 1024, so no
# capability is needed to bind it.
RUN touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html

USER nginx

EXPOSE 4000

# 127.0.0.1, not localhost: nginx listens on IPv4 only here and localhost
# resolves to ::1 first, which would fail against a healthy container.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:4000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

**Notable points:**
- **Multi-stage**: the Node toolchain never ships in the runtime image.
- **Reproducible installs**: `pnpm install --frozen-lockfile` fails rather than
  resolving something other than the lockfile.
- **Configurable API origin**: `API_URL` build arg, `/api` behind Nginx.
- **Non-root**: runs as the image's `nginx` user, with a healthcheck.

### API Dockerfile

[`api/Dockerfile`](https://github.com/nitin27may/mean-docker/blob/master/api/Dockerfile)
compiles TypeScript, then ships only the compiled output and production
dependencies.

```dockerfile
# Stage 1: compile TypeScript
FROM node:24-alpine AS builder

# corepack ships with Node and pins pnpm to the version in package.json, so the
# image does not depend on whatever pnpm happens to be latest at build time.
RUN corepack enable

WORKDIR /app

# Dependencies install from the lockfile on their own layer, so a source change
# does not invalidate the install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Stage 2: runtime — production dependencies and compiled output only
FROM node:24-alpine

RUN corepack enable

WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod && pnpm store prune

COPY --from=builder /app/dist ./dist

# Drop privileges: the node image ships an unprivileged "node" user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const p=process.env.PORT||3000;fetch('http://127.0.0.1:'+p+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
```

**Notable points:**
- **Multi-stage**: the runtime stage installs with `--prod`, so devDependencies
  and TypeScript sources stay out of the image.
- **Non-root**: runs as the `node` user the base image provides.
- **Healthcheck**: polls `/health`, which reports 503 while Mongo is down, so
  the container is only marked healthy when it can actually serve.

### Load Balancer (Nginx) Dockerfile

[`loadbalancer/Dockerfile`](https://github.com/nitin27may/mean-docker/blob/master/loadbalancer/Dockerfile)
is the single entry point in the Nginx deployment mode.

```dockerfile
FROM nginx:1.29-alpine

# This config replaces the whole nginx.conf, not a server block in conf.d.
COPY nginx.conf /etc/nginx/nginx.conf

# Run as the image's unprivileged nginx user. That means binding 8080 rather
# than 80 (ports below 1024 need a capability), so compose and the Kubernetes
# service publish 80 -> 8080.
RUN touch /tmp/nginx.pid \
    && chown -R nginx:nginx /tmp/nginx.pid /var/cache/nginx

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

**Notable points:**
- **Pinned base image**: `nginx:1.29-alpine`, not a floating tag.
- **Unprivileged**: listens on 8080, since binding 80 as a non-root user would
  need an extra capability. Compose publishes `80:8080`.

## Docker Compose Files

Three modes, all reproduced from the repository. Every service reads its
configuration from `.env` — see [`.env.example`](https://github.com/nitin27may/mean-docker/blob/master/.env.example)
for what each variable does and which code path reads it.

### Development (docker-compose.yml)

Each service is published on the host so you can hit it directly.

```yaml
# Development mode: every service is published on the host so you can hit each
# one directly (Angular :4000, Express :3000, MongoDB :27017).
# For the production-shaped single-entry-point setup use docker-compose.nginx.yml.
services:
  angular:
    build:
      context: frontend
      args:
        - API_URL=http://localhost:${EXPRESS_PORT:-3000}/api
    container_name: ${ID_PROJECT:-mean}_angular
    restart: always
    ports:
      - "4000:4000"
    depends_on:
      express:
        condition: service_healthy
    networks:
      - mean

  express:
    build: api
    container_name: ${ID_PROJECT:-mean}_express
    restart: always
    ports:
      - "${EXPRESS_PORT:-3000}:3000"
    # These are passed explicitly rather than via env_file so the API can also
    # point at a managed MongoDB by overriding the same variables.
    environment:
      - PORT=3000
      - NODE_ENV=${NODE_ENV:-development}
      - SECRET=${SECRET}
      - MONGO_DB_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB_HOST=${MONGO_DB_HOST}
      - MONGO_DB_PORT=${MONGO_DB_PORT}
      - MONGO_DB_PARAMETERS=${MONGO_DB_PARAMETERS}
      - MONGO_DB_DATABASE=${MONGO_DB_DATABASE}
    depends_on:
      database:
        condition: service_healthy
    networks:
      - mean

  database:
    # 8.2, not 8.0: MongoDB 8.0 refuses to start on Linux kernel 6.19+
    # (SERVER-121912), which rules it out on current distributions.
    image: mongo:8.2
    container_name: ${ID_PROJECT:-mean}_mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB=${MONGO_DB_DATABASE}
      - MONGO_INITDB_DATABASE=${MONGO_DB_DATABASE}
    volumes:
      # Seed scripts are read-only from the repo. The data itself lives in a
      # named volume rather than a bind mount, so it does not leave root-owned
      # files in your working tree. Seeding runs only against an empty volume —
      # `docker compose ... down -v` to reseed.
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/:ro
      - mongo-data:/data/db
    ports:
      - "${MONGO_DB_PORT:-27017}:27017"
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s
    networks:
      - mean

volumes:
  mongo-data:

networks:
  mean:
    driver: bridge
```

### Production-shaped (docker-compose.nginx.yml)

Nginx is the only published port; everything else stays on the internal
network. This is the mode the "single entry point" claim refers to.

```yaml
# Production-shaped mode: Nginx is the only published port. Angular, Express and
# MongoDB stay on the internal network and are reachable only through it.
services:
  angular:
    build:
      context: frontend
      args:
        - API_URL=/api
    container_name: ${ID_PROJECT:-mean}_angular
    restart: always
    networks:
      - mean

  express:
    build: api
    container_name: ${ID_PROJECT:-mean}_express
    restart: always
    environment:
      - PORT=3000
      - NODE_ENV=${NODE_ENV:-production}
      - SECRET=${SECRET}
      - MONGO_DB_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB_HOST=${MONGO_DB_HOST}
      - MONGO_DB_PORT=${MONGO_DB_PORT}
      - MONGO_DB_PARAMETERS=${MONGO_DB_PARAMETERS}
      - MONGO_DB_DATABASE=${MONGO_DB_DATABASE}
    depends_on:
      database:
        condition: service_healthy
    networks:
      - mean

  database:
    # 8.2, not 8.0: MongoDB 8.0 refuses to start on Linux kernel 6.19+
    # (SERVER-121912), which rules it out on current distributions.
    image: mongo:8.2
    container_name: ${ID_PROJECT:-mean}_mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB=${MONGO_DB_DATABASE}
      - MONGO_INITDB_DATABASE=${MONGO_DB_DATABASE}
    volumes:
      # Seed scripts are read-only from the repo. The data itself lives in a
      # named volume rather than a bind mount, so it does not leave root-owned
      # files in your working tree. Seeding runs only against an empty volume —
      # `docker compose ... down -v` to reseed.
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/:ro
      - mongo-data:/data/db
    # No host port: in this mode MongoDB is reachable only from the internal
    # network, which is what makes the "single entry point" claim true.
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s
    networks:
      - mean

  nginx:
    build: loadbalancer
    container_name: ${ID_PROJECT:-mean}_nginx
    restart: always
    ports:
      # The container listens on 8080 because it runs unprivileged.
      - "80:8080"
    depends_on:
      angular:
        condition: service_healthy
      express:
        condition: service_healthy
    networks:
      - mean

volumes:
  mongo-data:

networks:
  mean:
    driver: bridge
```

### Prebuilt images (docker-compose.hub.yml)

No local build — images come from Docker Hub. Set `IMAGE_TAG` to pin a
release rather than tracking `latest`.

```yaml
# Fastest start: prebuilt images pulled from Docker Hub, no local build.
# Pin a release with IMAGE_TAG (e.g. IMAGE_TAG=2.0.0) instead of tracking latest.
services:
  angular:
    image: nitin27may/mean-angular:${IMAGE_TAG:-latest}
    container_name: ${ID_PROJECT:-mean}_angular
    restart: always
    depends_on:
      express:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://127.0.0.1:4000/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - mean

  express:
    image: nitin27may/mean-expressjs:${IMAGE_TAG:-latest}
    container_name: ${ID_PROJECT:-mean}_express
    restart: always
    environment:
      - PORT=3000
      - NODE_ENV=${NODE_ENV:-production}
      - SECRET=${SECRET}
      - MONGO_DB_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB_HOST=${MONGO_DB_HOST}
      - MONGO_DB_PORT=${MONGO_DB_PORT}
      - MONGO_DB_PARAMETERS=${MONGO_DB_PARAMETERS}
      - MONGO_DB_DATABASE=${MONGO_DB_DATABASE}
    depends_on:
      database:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s
    networks:
      - mean

  database:
    # 8.2, not 8.0: MongoDB 8.0 refuses to start on Linux kernel 6.19+
    # (SERVER-121912), which rules it out on current distributions.
    image: mongo:8.2
    container_name: ${ID_PROJECT:-mean}_mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB_USERNAME=${MONGO_DB_USERNAME}
      - MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD}
      - MONGO_DB=${MONGO_DB_DATABASE}
      - MONGO_INITDB_DATABASE=${MONGO_DB_DATABASE}
    volumes:
      # Seed scripts are read-only from the repo. The data itself lives in a
      # named volume rather than a bind mount, so it does not leave root-owned
      # files in your working tree. Seeding runs only against an empty volume —
      # `docker compose ... down -v` to reseed.
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/:ro
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s
    networks:
      - mean

  nginx:
    image: nitin27may/mean-nginx:${IMAGE_TAG:-latest}
    container_name: ${ID_PROJECT:-mean}_nginx
    restart: always
    ports:
      # The container listens on 8080 because it runs unprivileged.
      - "80:8080"
    depends_on:
      angular:
        condition: service_healthy
      express:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://127.0.0.1:8080/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - mean

volumes:
  mongo-data:

networks:
  mean:
    driver: bridge
```

## Nginx Configuration

[`loadbalancer/nginx.conf`](https://github.com/nitin27may/mean-docker/blob/master/loadbalancer/nginx.conf)
is the gateway. Note that `frontend/nginx.conf` is a different file: it is the
static-file server inside the Angular image.

```nginx
worker_processes auto;

# Running unprivileged, so the pid and every temp path must live somewhere the
# nginx user can write.
pid /tmp/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  client_body_temp_path /tmp/client_temp;
  proxy_temp_path       /tmp/proxy_temp;
  fastcgi_temp_path     /tmp/fastcgi_temp;
  uwsgi_temp_path       /tmp/uwsgi_temp;
  scgi_temp_path        /tmp/scgi_temp;

  sendfile on;
  tcp_nopush on;
  server_tokens off;

  # Contact payloads are small; this stops a large body from reaching the API.
  client_max_body_size 2m;

  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_proxied any;
  gzip_types text/plain text/css application/json application/javascript
             text/xml application/xml application/xml+rss text/javascript
             image/svg+xml;

  map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
  }

  server {
    listen 8080;
    server_name _;

    # Docker's embedded DNS, re-resolved on a timer. The upstream address goes
    # through a variable deliberately: with a literal proxy_pass, nginx resolves
    # the name once at startup and keeps pointing at a stale IP after the
    # backend container is recreated.
    resolver 127.0.0.11 valid=10s ipv6=off;

    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host  $host;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;

    location /api {
      set $api_upstream http://express:3000;
      proxy_pass $api_upstream;
    }

    location / {
      set $app_upstream http://angular:4000;
      proxy_pass $app_upstream;
    }
  }
}
```

The two details worth understanding:

1. **Upstreams resolve per request.** The address goes through a variable so
   Docker's DNS is consulted on each request. With a literal `proxy_pass`,
   Nginx resolves the name once at startup and keeps sending traffic to a stale
   IP after a backend container is recreated.
2. **It listens on 8080.** The container runs as an unprivileged user, and
   binding port 80 as a non-root user requires an extra capability. Compose
   publishes `80:8080`, so nothing changes for the user.

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
docker compose -f docker-compose.nginx.yml up -d

# Without Nginx
docker compose up -d

# Using pre-built images
docker compose -f docker-compose.hub.yml up -d
```

### Viewing Logs

```bash
# All containers
docker compose -f docker-compose.nginx.yml logs -f

# Specific container
docker compose -f docker-compose.nginx.yml logs -f api
```

### Stopping the Application

```bash
docker compose -f docker-compose.nginx.yml down
```

### Rebuilding Containers

```bash
docker compose -f docker-compose.nginx.yml build
docker compose -f docker-compose.nginx.yml up -d
```

## Troubleshooting

### Container Won't Start

Check the logs for errors:
```bash
docker compose -f docker-compose.nginx.yml logs <service-name>
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
DOCKER_BUILDKIT=1 docker compose -f docker-compose.nginx.yml build
```

## Conclusion

This Docker setup provides a flexible, scalable approach to deploying the MEAN Stack application. The Nginx configuration offers a production-ready deployment with a single entry point, while the standard docker-compose file is useful for development and debugging.
