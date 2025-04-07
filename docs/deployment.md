---
layout: default
title: Deployment Guide
nav_order: 3
---

# Deployment Guide
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed
- Git installed
- A server or VM with sufficient resources

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/nitin27may/mean-docker.git
   cd mean-docker
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with appropriate values for your environment:
   ```
   SECRET=your_jwt_secret_key
   MONGO_DB_USERNAME=your_db_username
   MONGO_DB_PASSWORD=your_db_password
   MONGO_DB_HOST=database
   MONGO_DB_DATABASE=mean-contacts
   MONGO_DB_PARAMETERS=?authSource=admin
   ```

4. Deploy using one of the Docker Compose files:

   **4-Container Setup (Recommended for Production)**
   ```bash
   docker-compose -f docker-compose.nginx.yml up -d
   ```

   **2-Container Setup**
   ```bash
   docker-compose up -d
   ```

5. Verify deployment:
   ```bash
   docker-compose ps
   ```

6. Access the application:
   - 4-Container Setup: http://your-server-ip
   - 2-Container Setup: http://your-server-ip:3000

### SSL Configuration

To enable HTTPS:

1. Obtain SSL certificates (Let's Encrypt or similar)
2. Update the Nginx configuration in `loadbalancer/nginx.conf`:
   ```nginx
   server {
     listen 443 ssl;
     ssl_certificate /etc/nginx/certs/cert.pem;
     ssl_certificate_key /etc/nginx/certs/key.pem;
     
     # Rest of configuration...
   }
   ```
3. Create a volume mapping for certificates in `docker-compose.nginx.yml`:
   ```yaml
   nginx:
     volumes:
       - ./certs:/etc/nginx/certs
   ```

## Cloud Platform Deployment

### AWS Deployment

#### Using Elastic Beanstalk

1. Create a `Dockerrun.aws.json` file:
   ```json
   {
     "AWSEBDockerrunVersion": "3",
     "containerDefinitions": [
       {
         "name": "angular",
         "image": "nitin27may/mean-angular:latest",
         "essential": true,
         "memory": 256,
         "portMappings": [
           {
             "hostPort": 4000,
             "containerPort": 4000
           }
         ]
       },
       {
         "name": "express",
         "image": "nitin27may/mean-expressjs:latest",
         "essential": true,
         "memory": 256,
         "portMappings": [
           {
             "hostPort": 3000,
             "containerPort": 3000
           }
         ],
         "environment": [
           {
             "name": "MONGO_DB_HOST",
             "value": "database"
           }
           // Add other environment variables
         ]
       },
       {
         "name": "database",
         "image": "mongo:latest",
         "essential": true,
         "memory": 512,
         "portMappings": [
           {
             "hostPort": 27017,
             "containerPort": 27017
           }
         ]
       },
       {
         "name": "nginx",
         "image": "nitin27may/mean-nginx:latest",
         "essential": true,
         "memory": 128,
         "portMappings": [
           {
             "hostPort": 80,
             "containerPort": 80
           }
         ]
       }
     ]
   }
   ```

2. Deploy using the Elastic Beanstalk Console or CLI.

#### Using ECS/EKS

1. Create a cluster in ECS or EKS
2. Register the Docker images
3. Define task definitions
4. Create services
5. Set up load balancing

### Azure Deployment

#### Using Azure Container Apps

1. Create a resource group
2. Create container apps for each service
3. Set up networking between containers
4. Configure environment variables

#### Using Azure Kubernetes Service (AKS)

1. Create an AKS cluster
2. Apply Kubernetes manifests
3. Set up Azure Load Balancer

### Google Cloud Platform Deployment

#### Using Google Kubernetes Engine (GKE)

1. Create a GKE cluster
2. Apply Kubernetes manifests
3. Set up Cloud Load Balancing

## Manual Deployment

For a manual deployment without Docker:

### Prerequisites

- Node.js (LTS version)
- MongoDB installed and running
- Nginx (for production)

### Backend Deployment

1. Clone the repository:
   ```bash
   git clone https://github.com/nitin27may/mean-docker.git
   cd mean-docker/api
   ```

2. Install dependencies:
   ```bash
   npm install --production
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

4. Create `.env` file with appropriate settings.

5. Start the application:
   ```bash
   # Using PM2 (recommended)
   npm install -g pm2
   pm2 start dist/server.js --name "mean-api"
   
   # Or using systemd
   # Create a service file and enable it
   ```

### Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd mean-docker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build for production:
   ```bash
   npm run build:prod
   ```

4. Deploy the contents of the `dist/` directory to your web server.

### Nginx Configuration

Create an Nginx configuration file:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Continuous Integration/Continuous Deployment

### GitHub Actions

The repository includes GitHub Actions workflows in the `.github/workflows/` directory for CI/CD:

- `angular-build-and-push.yml`: Builds and pushes the Angular frontend image
- `expressjs-build-and-push.yml`: Builds and pushes the Express.js API image
- `mongo-build-and-push.yml`: Builds and pushes the MongoDB image
- `nginx-build-and-push.yml`: Builds and pushes the Nginx load balancer image

To use these workflows:

1. Fork the repository
2. Add the following secrets to your GitHub repository:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token
3. Push changes to trigger the workflows

# Add similar jobs for other components

deploy:
  stage: deploy
  script:
    - ssh user@server "cd /path/to/app && docker-compose -f docker-compose.nginx.yml pull && docker-compose -f docker-compose.nginx.yml up -d"

## Backup and Recovery

### MongoDB Backup

1. Schedule regular backups:
   ```bash
   docker exec mean_mongo mongodump --username $MONGO_DB_USERNAME --password $MONGO_DB_PASSWORD --authenticationDatabase admin --db mean-contacts --out /data/backup/$(date +%Y%m%d)
   ```

2. Copy backups to a secure location:
   ```bash
   docker cp mean_mongo:/data/backup ./backups
   ```

### Recovery

Restore from backup:
```bash
docker exec -i mean_mongo mongorestore --username $MONGO_DB_USERNAME --password $MONGO_DB_PASSWORD --authenticationDatabase admin --db mean-contacts /data/backup/20230101/mean-contacts
```

## Scaling

### Horizontal Scaling

For higher loads, you can scale the services horizontally:

1. Add more instances of the frontend and backend
2. Configure the load balancer to distribute traffic

With Docker Compose:
```bash
docker-compose -f docker-compose.nginx.yml up -d --scale angular=3 --scale express=3
```

### Vertical Scaling

Increase resources for containers in your Docker Compose file:
```yaml
services:
  express:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

## Environment-Specific Configuration

Different environments may require different configurations:

### Production

- Enable SSL/TLS
- Set up proper logging and monitoring
- Use a dedicated MongoDB instance
- Configure backups

### Staging/Testing

- Use a smaller MongoDB instance
- Configure for easier debugging
- May use mock services for testing

### Development

- Use hot reloading for faster development
- Enable debugging tools
- Use local MongoDB instance

## Troubleshooting

### Common Deployment Issues

1. **Container fails to start**:
   - Check logs: `docker logs container_name`
   - Verify environment variables
   - Check for port conflicts

2. **Database connection issues**:
   - Verify database credentials
   - Check network connectivity between containers
   - Ensure MongoDB is properly initialized

3. **CORS issues**:
   - Verify Nginx configuration
   - Check API for proper CORS headers

4. **Authentication problems**:
   - Verify JWT secret is consistent
   - Check token expiration settings
   - Ensure login endpoint is working

For more detailed troubleshooting, check container logs:
```bash
docker-compose -f docker-compose.nginx.yml logs -f
```