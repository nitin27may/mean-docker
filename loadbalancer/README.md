# Load Balancer (Nginx)

This directory contains the configuration for the Nginx load balancer used in the MEAN Stack Contacts application.

## Overview

The Nginx load balancer serves two primary purposes in this application:

1. **Unified Access Point**: Provides a single entry point (port 80) to access both frontend and backend services
2. **Reverse Proxy**: Routes requests to the appropriate container (Angular frontend or Express.js API)

## Configuration

`nginx.conf` replaces the image's entire `/etc/nginx/nginx.conf`, not just a
server block in `conf.d`. This file is the source of truth:

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

### Two Details Worth Understanding

**Upstreams resolve per request.** The address goes through a variable
(`set $api_upstream ...; proxy_pass $api_upstream;`) rather than a literal. With
a literal `proxy_pass`, Nginx resolves the hostname once at startup and keeps
sending traffic to that IP — so recreating the Express container leaves the
gateway pointing at an address that no longer exists. The variable form forces a
lookup against Docker's DNS on each request.

**It listens on 8080, not 80.** The container runs as the unprivileged `nginx`
user, and binding a port below 1024 as a non-root user needs an extra
capability. Compose publishes `80:8080`, so the user still visits
`http://localhost`. The `pid` and temp paths point at `/tmp` for the same
reason.

## Forwarded Headers

Every proxied request carries:

| Header | Why |
|---|---|
| `Host` | Preserves the host the client asked for |
| `X-Real-IP` / `X-Forwarded-For` | The client's address. Without these the API sees every request as coming from the proxy, which would make its rate limiting useless |
| `X-Forwarded-Proto` / `X-Forwarded-Host` | Lets the API reconstruct the original URL |
| `Upgrade` / `Connection` | WebSocket upgrades pass through |

The API sets `trust proxy` to exactly one hop to match.

Also enabled: gzip for text responses, a 2 MB body limit, and
`server_tokens off` so the version is not advertised.

## Dockerfile

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

## Usage

Defined in `docker-compose.nginx.yml` at the repository root:

```yaml
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
```

`depends_on` waits on healthchecks, so the gateway does not start accepting
traffic before its upstreams can serve it.

## Request Flow

1. The request arrives at Nginx on port 80 (8080 inside the container).
2. Paths starting with `/api` go to `express:3000`; everything else goes to
   `angular:4000`.
3. The response is returned to the client.

## Accessing Services

| | Nginx mode | Development mode |
|---|---|---|
| Frontend + API | `http://localhost` | — |
| Frontend directly | not published | `http://localhost:4000` |
| API directly | not published | `http://localhost:3000` |
| MongoDB | not published | `localhost:27017` |

In the Nginx modes only port 80 is published. That is the point of the mode —
it is what makes the "single entry point" claim true rather than decorative.

## Advanced Configuration Options

For production deployments, consider enhancing the Nginx configuration with:

### SSL Termination

```nginx
server {
  listen 443 ssl;
  ssl_certificate /etc/nginx/certs/cert.pem;
  ssl_certificate_key /etc/nginx/certs/key.pem;
  
  # Rest of configuration...
}
```

### HTTP/2 Support

```nginx
server {
  listen 443 ssl http2;
  # Rest of configuration...
}
```

### Caching Static Assets

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 30d;
  add_header Cache-Control "public, no-transform";
}
```

### Load Balancing Multiple Instances

For high availability, you can load balance across multiple instances of the frontend and backend:

```nginx
upstream frontend {
  server angular1:4000 weight=3;
  server angular2:4000 weight=1;
  server angular3:4000 backup;
}

upstream backend {
  server express1:3000;
  server express2:3000;
  least_conn;
}
```

### Rate Limiting

To protect the application from abuse:

```nginx
# Define a limit zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;

# Apply rate limiting to the API
location /api {
  limit_req zone=api_limit burst=10 nodelay;
  proxy_pass http://backend;
}
```

## Security Considerations

Enhance security with these settings:

```nginx
# Hide nginx version
server_tokens off;

# Add security headers
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header X-Frame-Options SAMEORIGIN;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'";
```