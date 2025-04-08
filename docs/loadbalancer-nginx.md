---
layout: default
title: Load Balancer (Nginx)
nav_order: 8
---

# Nginx Load Balancer
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Overview

Nginx serves as a load balancer and reverse proxy in the production setup of the MEAN Stack Contacts application.

## Key Functions

- **Single Entry Point**: Provides a unified entry point for all requests
- **Request Routing**: Routes requests to appropriate services
- **Static Content**: Efficiently serves static assets
- **Load Balancing**: Distributes traffic across multiple instances (when scaled)

## Nginx Configuration

The core Nginx configuration is straightforward:

```nginx
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

## Request Flow

1. Client sends request to Nginx (port 80)
2. Nginx examines the URL path:
   - If the path starts with `/api`, the request is forwarded to the Express.js API
   - Otherwise, the request is forwarded to the Angular application
3. The response flows back through Nginx to the client

## Benefits of This Approach

### Security

- Internal services are not directly exposed to the internet
- Nginx can handle TLS termination and certificate management
- IP filtering and rate limiting can be implemented at this layer

### Simplified Architecture

- Single exposed port for multiple services
- Frontend doesn't need to know the actual API URL
- Consistent request handling across environments

### Performance

- Efficient static content serving
- Connection pooling to backend services
- Content compression
- Caching capabilities

## Scaling Considerations

When scaling the application, Nginx can be configured to:

- Balance load across multiple backend instances
- Implement health checks
- Handle failover scenarios
- Enable sticky sessions if needed

## Customizing Nginx

The Nginx configuration can be customized for specific needs:

- Adding HTTP headers for security
- Implementing caching strategies
- Setting up URL rewriting
- Enabling gzip compression

## Extending with Additional Services

As the application grows, the Nginx configuration can easily be extended to route to additional services:

```nginx
# Example: Adding a reporting service
location /reports {
  proxy_pass http://reports-service:5000;
  # Additional headers and settings
}
```

This makes the architecture highly extensible for microservices.
