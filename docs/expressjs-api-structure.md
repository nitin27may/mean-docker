---
layout: default
title: API Structure
nav_order: 4
---

# Express.js API Structure
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Directory Structure

The Express.js API follows a modular architecture pattern:

![api](screenshots/api-folder-structure.png)

## Key Components

The API is organized with the following key directories:

- **src/controllers**: Request handlers
- **src/models**: MongoDB schema definitions
- **src/routes**: API route definitions
- **src/middlewares**: Authentication and validation middleware
- **src/services**: Business logic layer
- **src/config**: Configuration files

## API Endpoints

The API provides the following main endpoints:

1. **/api/auth**: Authentication endpoints (login, register)
2. **/api/contacts**: Contact management endpoints
3. **/api/users**: User management endpoints

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Server validates credentials and issues a JWT
3. Client includes JWT in subsequent request headers
4. Server validates JWT before processing protected requests
