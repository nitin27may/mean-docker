---
layout: default
title: Architecture
nav_order: 6
has_children: true
permalink: /docs/architecture
---

# Architecture
{: .no_toc }

This section describes the architectural design of the MEAN Stack Contacts application.

![Architecture Overview](architecture.drawio)

## Components

The application consists of the following main components:

1. **MongoDB Database**: Stores user and contact data
2. **Express.js API**: Provides RESTful endpoints for the frontend
3. **Angular Frontend**: User interface for the application
4. **Nginx**: Serves as a reverse proxy and load balancer (in production setup)

## Container Structure

The application can be deployed in two configurations:

### 2-Container Setup
- Frontend and API combined in one container
- MongoDB in a separate container

### 4-Container Setup (Production Recommended)
- Angular frontend container
- Express.js API container
- MongoDB container
- Nginx load balancer container

## Communication Flow

1. Client requests are received by Nginx (in production setup)
2. Nginx routes requests to either the Angular frontend or the Express.js API
3. The Angular frontend makes API calls to the Express.js backend
4. The Express.js API interacts with the MongoDB database for data operations
