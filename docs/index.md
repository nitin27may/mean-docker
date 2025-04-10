---
layout: home
title: Home
nav_order: 1
permalink: /
---

# MEAN Stack with Docker
{: .fs-9 }

A full-stack TypeScript contact management application with comprehensive Docker integration.
{: .fs-6 .fw-300 }

[Get Started](#-getting-started-in-30-seconds){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on GitHub](https://github.com/nitin27may/mean-docker){: .btn .fs-5 .mb-4 .mb-md-0 }

---

<p align="center">
  <img src="screenshots/contact-list.png" alt="Contacts List" width="600">
</p>

A modern, full-stack TypeScript contact management system built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) and containerized with Docker. Perfect for learning full-stack development or as a starting point for your own projects!

## 🌟 What You'll Learn

- **TypeScript** throughout the entire stack
- **Angular 19** with reactive forms, guards, and SSR
- **Express.js** with TypeScript for a robust API
- **MongoDB** integration with Mongoose
- **JWT Authentication** for secure user management
- **Docker** containerization for development and production
- **Nginx** as a load balancer and API gateway
- **CI/CD** with GitHub Actions

## 🚀 Getting Started in 30 Seconds

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop){:target="_blank"} and Docker Compose
- [Git](https://git-scm.com/downloads){:target="_blank"}

### Quick Start Commands

Clone the repository:
```bash
git clone https://github.com/nitin27may/mean-docker.git
```

Navigate to project folder:
```bash
cd mean-docker
```

Create environment file:
```bash
cp .env.example .env
```

Start the application:
```bash
docker-compose -f docker-compose.nginx.yml up
```

That's it! Visit [http://localhost](http://localhost) in your browser.

**Login with:**
- Username: `nitin27may@gmail.com`
- Password: `P@ssword#321`

## 🏗️ System Architecture

<p align="center">
  <img src="screenshots/architecture.png" alt="Architecture Diagram" width="600">
</p>

### Single Entry Point Architecture

When using the `docker-compose.nginx.yml` configuration, all traffic flows through a single port (80):

- **Single Exposed Port**: Only port 80 is exposed to the outside world
- **Unified Access Point**: Both UI and API requests enter through Nginx
- **Intelligent Routing**: 
  - Requests to `/api/*` are proxied to the Express.js service
  - All other requests are served by the Angular frontend
- **Simplified Deployment**: No need to manage multiple public endpoints
- **Enhanced Security**: Internal services remain isolated from direct external access

## 💻 Key Features

### User Authentication

<p align="center">
  <img src="screenshots/login.png" alt="Login Screen" width="400">
</p>

- JWT-based secure login and registration
- Protected routes with Angular guards
- Token-based API authorization
- Password change functionality

### Contact Management

- Create, read, update, and delete contacts
- Responsive design for mobile and desktop
- Form validation with custom error messages
- Search, sort, and paginate contacts

## 📚 Documentation

For more detailed information, explore these documentation pages:

- [Docker Guide](docs/docker-guide.html)
- [Local Development Guide](docs/local-devlopment.html)
- [MongoDB Setup](docs/mongo-readme.html)
- [Architecture Overview](docs/architecture.html)
- [API (Expressjs)](api/README.html)
- [Frontend (Angular)](frontend/README.html)
- [Load Balancer (Nginx)](loadbalancer/README.html)
- [Future Roadmap](docs/roadmap.html)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.html) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/nitin27may/mean-docker/blob/master/LICENSE){:target="_blank"} file for details.
