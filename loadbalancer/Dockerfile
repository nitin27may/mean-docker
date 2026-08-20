# Use the standard Nginx image from Docker Hub
FROM nginx
# Copy the configuration file from the current directory and paste
# it inside the container to use it as Nginx's default config.
COPY nginx.conf /etc/nginx/nginx.conf
# Port 80 of the container is exposed and mapped to port 80 of the host
# via Compose, so the whole stack is reachable at http://localhost.
EXPOSE 80

# Start Nginx when the container has provisioned.
CMD ["nginx", "-g", "daemon off;"]