# API (Expressjs)

This directory contains the TypeScript-based Express.js REST API for the MEAN Stack Contacts Application.

## Stack

| | |
|---|---|
| Runtime | Node 24 (Active LTS) |
| Framework | Express 5 |
| Database | MongoDB 8.2 via Mongoose 9 |
| Language | TypeScript 6, `strict: true` |
| Auth | JWT, `Authorization: Bearer` only |
| Hardening | Helmet, rate limiting, CORS allowlist |
| Docs | Swagger at `/api-docs` |
| Tests | Vitest |
| Lint | ESLint flat config |
| Package manager | pnpm 11 |

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

- Node.js 24+
- pnpm 11+ (`corepack enable` ships it with Node)
- MongoDB instance (local or remote)

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file:
   ```
   PORT=3000
   NODE_ENV=development
   SECRET=<at least 32 characters — openssl rand -base64 48>
   CORS_ORIGINS=
   MONGO_DB_USERNAME=mongodb_username
   MONGO_DB_PASSWORD=mongodb_password
   MONGO_DB_HOST=localhost
   MONGO_DB_PORT=27017
   MONGO_DB_DATABASE=contact_db
   MONGO_DB_PARAMETERS=?authSource=admin
   ```

   **`SECRET` is required.** The API refuses to start when it is missing, still
   the `.env.example` placeholder, or shorter than 32 characters. There is no
   fallback on purpose — the previous default was published in this repository,
   which meant every deployment that followed the README shared a signing key.

   Set `MONGODB_URI` instead of the discrete `MONGO_DB_*` variables to point at
   a managed MongoDB; it takes precedence.

### Development

Start the development server with hot reloading:
```bash
pnpm run dev:watch
```

### Testing and Linting

```bash
pnpm test          # Vitest
pnpm run lint      # ESLint
```

### Building for Production

Build the TypeScript code:
```bash
pnpm run build
```

Start the production server:
```bash
pnpm start
```

## Docker Support

The API can be run in a Docker container. Build and run with:

```bash
docker build -t contacts-api .
docker run -p 3000:3000 contacts-api
```

Or bring up the whole stack from the repository root, which is usually what
you want since the API needs MongoDB:

```bash
docker compose up --build
```

## API Documentation

Swagger UI is available at `/api-docs` when the server is running. The spec is
assembled in `src/config/swagger.ts` from JSDoc annotations on the routes.

## Health Check

`GET /health` returns 200 when MongoDB is connected and **503 when it is not**,
so a container is only reported healthy when it can actually serve a request.
It is exempt from rate limiting and backs both the Docker healthcheck and the
Kubernetes probes.

```json
{ "status": "ok", "database": "connected", "uptime": 12.07 }
```

## Authentication

JWT. To reach a protected endpoint:

1. Obtain a token from `POST /api/user/authenticate`.
2. Send it as a header:
   ```
   Authorization: Bearer your_jwt_token
   ```

Tokens are accepted **only** from that header. Passing `?token=` used to work
and no longer does — query strings end up in access logs, browser history and
`Referer` headers.

Authentication is rate limited to 10 attempts per 15 minutes per IP; the rest
of the API allows 300 requests per 15 minutes.

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