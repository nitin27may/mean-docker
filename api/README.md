# API (Expressjs)

This directory contains the TypeScript-based Express.js REST API for the MEAN Stack Contacts Application.

## Features

- **TypeScript** for enhanced type safety and code quality
- **JWT Authentication** for secure user management
- **MongoDB Integration** using Mongoose
- **RESTful API Design** following best practices
- **Swagger Documentation** for API endpoints
- **Error Handling** with consistent response formats
- **Environment Configuration** for different deployment scenarios

## Directory Structure

```
api/
├── src/                # TypeScript source files
│   ├── config/         # Configuration files
│   │   ├── database.ts # MongoDB connection
│   │   ├── env.ts      # Environment variables
│   │   └── swagger.ts  # Swagger configuration
│   ├── controllers/    # Request handlers
│   │   ├── ContactController.ts
│   │   └── UserController.ts
│   ├── middlewares/    # Custom middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/         # MongoDB models
│   │   ├── contact.ts
│   │   └── user.ts
│   ├── routes/         # API routes
│   │   └── api.routes.ts
│   └── server.ts       # Application entry point
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## API Endpoints

### Authentication

- **POST /api/user/authenticate** - Authenticate user and get JWT token
  - Request: `{ username: string, password: string }`
  - Response: `{ status: string, message: string, token: string, data: User }`

### Users

- **GET /api/users** - Get all users (requires authentication)
  - Response: `{ status: string, message: string, data: User[] }`

- **POST /api/users** - Create a new user
  - Request: `{ firstName: string, lastName: string, username: string, password: string }`
  - Response: `{ message: string, data: User }`

- **GET /api/user/:user_id** - Get user by ID (requires authentication)
  - Response: `{ message: string, data: User }`

- **PUT /api/user/:user_id** - Update user (requires authentication)
  - Request: `{ firstName?: string, lastName?: string, email?: string, mobile?: string }`
  - Response: `{ message: string, data: User }`

- **DELETE /api/user/:user_id** - Delete user (requires authentication)
  - Response: `{ status: string, message: string }`

- **PUT /api/user/changepassword/:user_id** - Change user password (requires authentication)
  - Request: `{ password: string }`
  - Response: `{ status: string, message: string }`

### Contacts

- **GET /api/contacts** - Get all contacts (requires authentication)
  - Response: `{ status: string, message: string, data: Contact[] }`

- **POST /api/contacts** - Create a new contact (requires authentication)
  - Request: `{ firstName: string, lastName: string, mobile: string, email?: string, city?: string, postalCode?: string }`
  - Response: `{ message: string, data: Contact }`

- **GET /api/contact/:contact_id** - Get contact by ID (requires authentication)
  - Response: `{ message: string, data: Contact }`

- **PUT /api/contact/:contact_id** - Update contact (requires authentication)
  - Request: `{ firstName?: string, lastName?: string, mobile?: string, email?: string, city?: string, postalCode?: string }`
  - Response: `{ message: string, data: Contact }`

- **DELETE /api/contact/:contact_id** - Delete contact (requires authentication)
  - Response: `{ status: string, message: string }`

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- MongoDB instance (local or remote)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=3000
   SECRET=your_jwt_secret
   MONGO_DB_USERNAME=mongodb_username
   MONGO_DB_PASSWORD=mongodb_password
   MONGO_DB_HOST=localhost
   MONGO_DB_PORT=27017
   MONGO_DB_DATABASE=contacts
   MONGO_DB_PARAMETERS=?authSource=admin
   ```

### Development

Start the development server with hot reloading:
```bash
npm run dev:watch
```

### Building for Production

Build the TypeScript code:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Docker Support

The API can be run in a Docker container. Build and run with:

```bash
docker build -t contacts-api .
docker run -p 3000:3000 contacts-api
```

Or use docker-compose:
```bash
docker-compose up
```

## API Documentation

Swagger UI is available at `/api-docs` when the server is running.

## Authentication

This API uses JWT for authentication. To access protected endpoints:

1. Obtain a token by logging in via `/api/user/authenticate`
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer your_jwt_token
   ```

## Error Handling

The API follows a consistent error handling pattern:

- Success responses have status code 200 and follow the format:
  ```json
  {
    "status": "success",
    "message": "Operation successful",
    "data": { ... }
  }
  ```

- Error responses include appropriate status codes (400, 401, 404, 500) and follow the format:
  ```json
  {
    "status": "error",
    "message": "Error description"
  }
  ```

## Models

### User

```typescript
interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  token?: string;
  email?: string;
  mobile?: string;
  create_date: Date;
}
```

### Contact

```typescript
interface IContact extends Document {
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  city?: string;
  postalCode?: string;
  create_date: Date;
}
```