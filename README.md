# MEAN Stack Contacts Application

[![Angular Build](https://github.com/nitin27may/mean-docker/workflows/Angular%20Build/badge.svg)](https://github.com/nitin27may/mean-docker/actions)
[![Express Build](https://github.com/nitin27may/mean-docker/workflows/Expressjs%20Build/badge.svg)](https://github.com/nitin27may/mean-docker/actions)
[![MongoDB Build](https://github.com/nitin27may/mean-docker/workflows/Mongo%20Build/badge.svg)](https://github.com/nitin27may/mean-docker/actions)
[![Nginx Build](https://github.com/nitin27may/mean-docker/workflows/Nginx%20Build/badge.svg)](https://github.com/nitin27may/mean-docker/actions)

## Introduction

The MEAN Stack Contacts Application is a comprehensive, production-ready contact management system built using the MEAN stack (MongoDB, Express.js, Angular, Node.js). This application demonstrates modern web development practices including containerization, microservices architecture, and CI/CD integration.

Perfect for developers looking to understand how to:
- Implement a full-stack JavaScript application
- Structure Docker-based microservices
- Deploy applications using modern DevOps practices
- Build secure authentication systems with JWT
- Create responsive, accessible user interfaces

This project serves as both a practical application for managing contacts and an educational resource for developers wanting to explore MEAN stack development with Docker.

## Key Features

### User Management
- **Secure Authentication**: JWT-based token authentication system
- **User Registration**: Self-service account creation with email verification
- **Profile Management**: Update personal information and preferences
- **Password Protection**: Secure password hashing and reset functionality

### Contact Management
- **Comprehensive Contact Records**: Store detailed contact information including personal details, addresses, and custom fields
- **Advanced Search**: Quickly find contacts with multi-field search capabilities
- **Contact Organization**: Group and categorize contacts with tags and custom fields
- **Import/Export**: Transfer contact data via CSV/JSON formats
- **Contact History**: Track interactions and changes to contact records

### Technical Architecture
- **Containerized Deployment**: Fully dockerized application with separate containers for each component
- **Scalable Design**: Horizontally scalable architecture with load balancing via Nginx
- **Database Integration**: MongoDB with mongoose ODM for data modeling
- **API Security**: Protected endpoints with JWT verification middleware
- **Server-Side Rendering**: Angular Universal implementation for improved performance and SEO
- **Responsive Design**: Mobile-first interface built with Bootstrap 5
- **Error Handling**: Comprehensive client and server-side error management
- **Logging**: Detailed application logging for troubleshooting

### DevOps Features
- **CI/CD Integration**: GitHub Actions workflows for automated testing and deployment
- **Multiple Deployment Options**: Development, staging, and production configurations
- **Environment Configuration**: Externalized configuration via environment variables
- **Kubernetes Support**: Deployment manifests for Kubernetes environments


## Overview

This project demonstrates a full MEAN (MongoDB, Express, Angular, Node.js) stack application running with Docker. It features:

- User authentication with JWT
- Contact management system (CRUD operations)
- Responsive UI with Bootstrap 5
- Server-side rendering with Angular Universal
- Containerized with Docker for both development and production
- GitHub Actions for CI/CD

## Demo

[Demo video placeholder - Add your demo video or screenshots here]

## System Architecture

![Architecture Diagram](docs/screenshots/architecture.png)

The application consists of four main components, each running in its own container:

1. **Frontend (Angular)**: Provides the user interface
2. **Backend (Express.js)**: Handles API requests and business logic
3. **Database (MongoDB)**: Stores user and contact data
4. **Load Balancer (Nginx)**: Manages traffic between frontend and backend

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose
- [Git](https://git-scm.com/downloads)

### Running the Application

Clone the repository:

```bash
git clone https://github.com/nitin27may/mean-docker.git
cd mean-docker
```

Create environment file:

```bash
cp .env.example .env
```

Start the application using Docker Compose:

```bash
docker-compose -f 'docker-compose.nginx.yml' up
```

The application will be available at:
- Frontend + API: http://localhost
- Frontend only: http://localhost:4000
- API only: http://localhost:3000
- MongoDB: localhost:27017

### Default Login Credentials

```
Username: nitin27may@gmail.com
Password: P@ssword#321
```

## Running in Different Modes

### Development Mode

This starts the application with hot reloading for both frontend and backend:

```bash
docker-compose -f 'docker-compose.debug.yml' up
```

- Frontend: http://localhost:4200
- API: http://localhost:3000
- MongoDB: localhost:27017

### Production Mode (2 Containers)

Runs Express.js serving both frontend and API in a single container with MongoDB:

```bash
docker-compose up
```

- Application: http://localhost:3000
- MongoDB: localhost:27017

### Production Mode (4 Containers)

Runs each component in a separate container using Nginx as a load balancer:

```bash
docker-compose -f 'docker-compose.nginx.yml' up
```

- Application: http://localhost
- Frontend: http://localhost:4000
- API: http://localhost:3000
- MongoDB: localhost:27017

## Project Structure

| Directory | Description |
|-----------|-------------|
| **[`/frontend`](./frontend/README.md)** | Angular application |
| **[`/api`](./api/README.md)** | Express.js API |
| **[`/loadbalancer`](./loadbalancer/README.md)** | Nginx configuration |
| **[`/mongo`](./mongo/README.md)** | MongoDB initialization scripts |
| **[`/manifest`](./manifest/)** | Kubernetes deployment files |

For detailed information about each component, see the README in the respective directory.

## Core Features

### Authentication System

- JWT-based authentication
- User registration and login
- Password change functionality
- Route guards for protected pages

### Contact Management

- List all contacts with pagination
- View contact details
- Add new contacts
- Edit existing contacts
- Delete contacts

### Technical Features

- Angular SSR (Server-Side Rendering)
- Responsive design with Bootstrap 5
- Form validation
- MongoDB integration
- RESTful API architecture
- Docker containerization
- GitHub Actions for CI/CD

## Development Guide

For comprehensive development guides, see:

- [Frontend Development Guide](./frontend/README.md)
- [API Development Guide](./api/README.md)
- [Database Guide](./mongo/README.md)
- [Load Balancer Configuration](./loadbalancer/README.md)
- [Deployment Guide](./docs/deployment.md)

## Running Without Docker

See the [Local Development Guide](./docs/local-development.md) for instructions on running the application without Docker.

## Roadmap

For future plans and development priorities, see our [Roadmap](./docs/roadmap.md).

## Contributing

We welcome contributions! Please check our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest enhancements.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Nitin Singh - [@nitin27may](https://twitter.com/nitin27may)

Project Link: [https://github.com/nitin27may/mean-docker](https://github.com/nitin27may/mean-docker)