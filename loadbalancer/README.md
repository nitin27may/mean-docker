# NGINX - loadbalancer Image


## nginx Dockerfile

```dockerfile
# Use the standard Nginx image from Docker Hub
FROM nginx
# Copy the configuration file from the current directory and paste
# it inside the container to use it as Nginx's default config.
COPY nginx.conf /etc/nginx/nginx.conf
# Port 8080 of the container will be exposed and then mapped to port
# 8080 of our host machine via Compose. This way we'll be able to
# access the server via localhost:8080 on our host.
EXPOSE 8000

# Start Nginx when the container has provisioned.
CMD ["nginx", "-g", "daemon off;"]

```
### NGINX config

 ```
events {
    worker_connections 1024;
  }
http {
  upstream frontend {
    # These are references to our backend containers, facilitated by
    # Compose, as defined in docker-compose.yml
    server angular:4000;
  } 
  upstream backend {
    # These are references to our backend containers, facilitated by
    # Compose, as defined in docker-compose.yml
    server express:3000;
  }
  

server {
    listen 8000;
    server_name frontend;
    server_name backend;

    location / {
       proxy_pass http://frontend;
       proxy_set_header Host $host;
    }
    location /api {
       proxy_pass http://backend;
       proxy_set_header Host $host;
    }
  }
}

 ```