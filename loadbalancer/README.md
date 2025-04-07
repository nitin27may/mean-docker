# Load Balancer (Nginx)

This directory contains the configuration for the Nginx load balancer used in the MEAN Stack Contacts application.

## Overview

The Nginx load balancer serves two primary purposes in this application:

1. **Unified Access Point**: Provides a single entry point (port 80) to access both frontend and backend services
2. **Reverse Proxy**: Routes requests to the appropriate container (Angular frontend or Express.js API)

## Configuration

The core configuration is defined in `nginx.conf`:

```nginx
events {
  worker_connections 1024;
}
http {
  upstream frontend {
    # Reference to the Angular container
    server angular:4000;
  } 
  upstream backend {
    # Reference to the Express.js container
    server express:3000;
  }
  
  server {
    listen 80;
    server_name frontend;
    server_name backend;

    location / {
       resolver 127.0.0.11 valid=30s;
       proxy_pass http://frontend;
       proxy_set_header Host $host;
    }
    location /api {
       resolver 127.0.0.11 valid=30s;
       proxy_pass http://backend;
       proxy_set_header Host $host;
    }
  }
}
```

### Key Components

- **`upstream` Blocks**: Define the backend server groups
- **`location` Directives**:
  - `/`: Routes all root requests to the Angular frontend
  - `/api`: Routes all API requests to the Express.js backend
- **`resolver`**: Used for Docker's internal DNS resolution
- **`proxy_pass`**: Forwards requests to the appropriate upstream server
- **`proxy_set_header`**: Preserves the original host information

## Dockerfile

The Nginx container is built using the following Dockerfile:

```dockerfile
FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Usage

The load balancer is configured in the `docker-compose.nginx.yml` file at the root of the project:

```yaml
nginx:
  build: loadbalancer
  container_name: ${ID_PROJECT:-mean}_nginx
  restart: always
  ports:
    - "80:80"
  links:
    - express
    - angular
```

## Request Flow

When a user makes a request to the application:

1. The request is received by Nginx on port 80
2. Nginx examines the URL path:
   - If it starts with `/api`, the request is forwarded to the Express.js container
   - For all other paths, the request is forwarded to the Angular container
3. The appropriate service processes the request and sends a response
4. Nginx forwards the response back to the client

## HTTP Headers

The following headers are set for proxied requests:

- `Host`: Set to the original host requested by the client

## Accessing Services

With the load balancer in place, you can access services through these URLs:

- **Frontend + API**: `http://localhost` 
- **Frontend directly**: `http://localhost:4000`
- **API directly**: `http://localhost:3000`

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