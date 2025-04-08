---
layout: default
title: Local Development
nav_order: 3
---

# Local Development
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

# Local Development Guide

This guide explains how to set up and run the MEAN Stack Contacts application locally without Docker.

## Prerequisites

Before getting started, make sure you have the following installed:

1. **Node.js** (LTS version (22+) recommended): [Download Node.js](https://nodejs.org/){:target="_blank"}
2. **npm** (comes with Node.js)
3. **MongoDB** (Community Edition): [Download MongoDB](https://www.mongodb.com/try/download/community){:target="_blank"}
4. **Angular CLI** (optional but recommended): `npm install -g @angular/cli`

## MongoDB Setup

### Installation

1. Install MongoDB Community Edition following the [official instructions](https://docs.mongodb.com/manual/installation/){:target="_blank"} for your operating system.
2. Start the MongoDB service:
   - Windows: The MongoDB service should start automatically
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Database Initialization

1. Create a new database:
   ```bash
   mongosh
   use mean-contacts
   ```

2. Create an admin user:
   ```javascript
   db.createUser({
     user: "admin-user",
     pwd: "admin-password",
     roles: [{ role: "readWrite", db: "mean-contacts" }]
   })
   ```

3. Create a test user:
   ```javascript
   db.users.insertOne({
     username: "nitin27may@gmail.com",
     email: "nitin27may@gmail.com",
     password: "$2a$10$nc0yO2eeCDOLg6sObsAHfuXQY8NnCrhHz5GbkmPYsAGLsQoSZa.qm", // P@ssword#321
     firstName: "Nitin",
     lastName: "Singh",
     create_date: new Date()
   })
   ```

4. Add sample contacts:
   ```javascript
   db.contacts.insertMany([
     {
       firstName: "Nitin",
       lastName: "Singh",
       mobile: "9876543243",
       email: "nitin27may@gmail.com",
       city: "Mumbai",
       postalCode: "421201",
       create_date: new Date()
     },
     {
       firstName: "Sachin",
       lastName: "Singh",
       mobile: "9876540000",
       email: "sachin@gmail.com",
       city: "Pune",
       postalCode: "421201",
       create_date: new Date()
     },
     {
       firstName: "Vikram",
       lastName: "Singh",
       mobile: "9876541111",
       email: "vikram@gmail.com",
       city: "Pune",
       postalCode: "421201",
       create_date: new Date()
     }
   ])
   ```

## Backend (API) Setup

1. Navigate to the API directory:
   ```bash
   cd mean-docker/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

      example`:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=3000
   SECRET=your_jwt_secret_key
   MONGO_DB_USERNAME=admin-user
   MONGO_DB_PASSWORD=admin-password
   MONGO_DB_HOST=localhost
   MONGO_DB_PORT=27017
   MONGO_DB_PARAMETERS=?authSource=admin
   MONGO_DB_DATABASE=mean-contacts
   ```

4. Start the API in development mode:
   ```bash
   npm run dev:watch
   ```

The API will be available at `http://localhost:3000/api`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd mean-docker/frontend
   ```
2. Updated the API endpoint in environment.ts

   ```
   export const environment = {
    production: false,
    apiEndpoint: 'http://localhost:3000/api',  // updating this
    angular: 'Angular 19',
    bootstrap: 'Bootstrap 5',
    expressjs: 'Express.js 4.17.1',
    mongoDb: 'MongoDB 7.0',
};

   ```
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run serve
   ```

The frontend will be available at `http://localhost:4200`.

## Testing the Application

1. Open your browser and navigate to `http://localhost:4200`
2. Log in with the test credentials:
   - Username: `nitin27may@gmail.com`
   - Password: `P@ssword#321`
3. After successful login, you'll be redirected to the home page
4. Navigate to Contacts to view, add, edit, and delete contacts

## Debugging

### Backend Debugging

1. You can debug the Node.js backend using:
   - Visual Studio Code's debugger (launch configuration is included)
   - Chrome DevTools by running:
     ```bash
     node --inspect server.js
     ```
   - Then open `chrome://inspect` in Chrome

2. For real-time API testing, use tools like:
   - [Postman](https://www.postman.com/){:target="_blank"}
   - [Insomnia](https://insomnia.rest/){:target="_blank"}

### Frontend Debugging

1. Use the Angular DevTools extension for Chrome
2. Use the browser's built-in DevTools (F12)
3. Enable source maps in Chrome for better debugging

## Common Issues

### MongoDB Connection Problems

If you encounter issues connecting to MongoDB:

1. Ensure MongoDB is running: `mongosh`
2. Check your firewall settings
3. Verify credentials in the `.env` file
4. Try connecting manually:
   ```bash
   mongosh mongodb://admin-user:admin-password@localhost:27017/mean-contacts?authSource=admin
   ```

### CORS Issues

If you encounter CORS errors:

1. Ensure the API is running on the expected port (3000)
2. Check the frontend is correctly proxying requests to the API

### JWT Authentication Issues

If authentication fails:

1. Check the SECRET in your `.env` file
2. Ensure the user exists in the database with the correct credentials
3. Verify the token is being sent correctly in the Authorization header

## Building for Production

### Backend

```bash
cd mean-docker/api
npm run build
```

### Frontend

```bash
cd mean-docker/frontend
npm run build:prod
```

The frontend build will create a production-ready bundle in the `dist/` directory, which can be deployed to any static hosting service or server.