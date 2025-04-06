# Local Development Guide

This guide explains how to set up and run the MEAN Stack Contacts application locally without Docker.

## Prerequisites

Before getting started, make sure you have the following installed:

1. **Node.js** (LTS version recommended): [Download Node.js](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **MongoDB** (Community Edition): [Download MongoDB](https://www.mongodb.com/try/download/community)
4. **Nodemon** (for API development): `npm install -g nodemon`
5. **Angular CLI** (optional): `npm install -g @angular/cli`

## MongoDB Setup

### Installation

1. Install MongoDB Community Edition following the [official instructions](https://docs.mongodb.com/manual/installation/) for your operating system.
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
       email: "saching@gmail.com",
       city: "Pune",
       postalCode: "421201",
       create_date: new Date()
     },
     {
       firstName: "Vikram",
       lastName: "Singh",
       mobile: "9876540000",
       email: "saching@gmail.com",
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
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB connection details:
   ```
   EXPRESS_PORT=3000
   SECRET=Thisismysecret
   MONGO_DB_USERNAME=admin-user
   MONGO_DB_PASSWORD=admin-password
   MONGO_DB_HOST=localhost
   MONGO_DB_PORT=27017
   MONGO_DB_PARAMETERS=?authSource=admin
   MONGO_DB_DATABASE=mean-contacts
   ```

5. Start the API in development mode:
   ```bash
   npm run dev-server
   ```

The API will be available at `http://localhost:3000/api`.

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd mean-docker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:4200`.

## Running Both Together

For convenience, you can run both the frontend and backend together from the frontend directory:

```bash
# From the frontend directory
npm run dev-server
```

This command is configured in the frontend's `package.json` and runs both services simultaneously.

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
   - Visual Studio Code's debugger
   - Chrome DevTools by running:
     ```bash
     node --inspect server.js
     ```
   - Then open `chrome://inspect` in Chrome

2. For real-time API testing, use tools like:
   - [Postman](https://www.postman.com/)
   - [Insomnia](https://insomnia.rest/)

### Frontend Debugging

1. Use the Angular DevTools extension for Chrome
2. Use the browser's built-in DevTools (F12)
3. Enable source maps in Chrome for better debugging

## Database Management

For managing the MongoDB database, consider using:

1. [MongoDB Compass](https://www.mongodb.com/products/compass)
2. [Robo 3T](https://robomongo.org/)
3. [Studio 3T](https://studio3t.com/)

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