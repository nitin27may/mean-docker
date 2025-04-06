# API (Express.js)

This directory contains the backend API for the MEAN Stack Contacts System, built with Express.js.

## Technology Stack

- **Express.js**: v4.17.1
- **MongoDB**: Integration via Mongoose v6.3.4
- **Authentication**: JWT (jsonwebtoken v8.5.1)
- **Security**: bcryptjs for password hashing

## Development Server

### Local Development

```bash
# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev-server
```

The API will be available at `http://localhost:3000/api`.

## Project Structure

```
api/
├── config/               # Configuration files
│   ├── database.js       # Database connection config
│   ├── env.js            # Environment loader
│   └── environment.js    # Environment variables
├── controllers/          # Request handlers
│   ├── contact.controller.js  # Contact CRUD operations
│   └── users.controller.js    # User auth and management
├── models/               # Mongoose models
│   ├── contact.model.js  # Contact schema
│   └── user.model.js     # User schema
├── api-routes.js         # API route definitions
└── server.js             # Main application entry point
```

## API Endpoints

### Authentication

- **POST** `/api/user/authenticate`: User login
  - Body: `{ username, password }`
  - Returns: User details with JWT token

### Users

- **GET** `/api/users`: Get all users (protected)
- **POST** `/api/users`: Create a new user
- **GET** `/api/user/:user_id`: Get user details (protected)
- **PUT** `/api/user/:user_id`: Update user (protected)
- **DELETE** `/api/user/:user_id`: Delete user (protected)
- **PUT** `/api/user/changepassword/:user_id`: Change user password (protected)

### Contacts

- **GET** `/api/contacts`: Get all contacts (protected)
- **POST** `/api/contacts`: Create a new contact (protected)
- **GET** `/api/contact/:contact_id`: Get contact details (protected)
- **PUT** `/api/contact/:contact_id`: Update contact (protected)
- **DELETE** `/api/contact/:contact_id`: Delete contact (protected)

## Authentication & Security

The API uses JWT (JSON Web Token) for authentication:

1. Users authenticate via `/api/user/authenticate`
2. Server validates credentials and returns a JWT token
3. Clients include the token in the Authorization header for protected routes
4. `express-jwt` middleware validates tokens on protected routes

JWT configuration in `api-routes.js`:

```javascript
const jwtAuth = jwt({ secret: environment.secret, algorithms: ["HS256"] });
```

## Environment Variables

The API uses the following environment variables:

- `EXPRESS_PORT`: Port to run the API (default: 3000)
- `SECRET`: JWT signing secret
- `MONGO_DB_USERNAME`: MongoDB username
- `MONGO_DB_PASSWORD`: MongoDB password
- `MONGO_DB_HOST`: MongoDB host
- `MONGO_DB_PORT`: MongoDB port
- `MONGO_DB_PARAMETERS`: MongoDB connection parameters
- `MONGO_DB_DATABASE`: MongoDB database name

Create a `.env` file based on `.env.example` to configure these variables.

## MongoDB Connection

The database connection is configured in `config/database.js`:

```javascript
const env = require("./env");

env.get();
module.exports = {
  mongodb: {
    uri:
      "mongodb://" +
      process.env.MONGO_DB_USERNAME +
      ":" +
      process.env.MONGO_DB_PASSWORD +
      "@" +
      process.env.MONGO_DB_HOST +
      (process.env.MONGO_DB_PORT
        ? ":" + process.env.MONGO_DB_PORT + "/"
        : "/") +
      process.env.MONGO_DB_DATABASE +
      process.env.MONGO_DB_PARAMETERS,
  },
};
```

## Models

### User Model

```javascript
var userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: String,
  email: String,
  mobile: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});
```

### Contact Model

```javascript
var contactSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  email: String,
  city: String,
  postalCode: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});
```

## Docker Support

### Development Dockerfile

```dockerfile
FROM node:21-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . /api/
EXPOSE 3000 9229
```

### Production Dockerfile

```dockerfile
FROM node:21-alpine

COPY package.json package-lock.json ./

RUN npm set strict-ssl false
RUN npm i && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . /app/

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

## Error Handling

The API uses a consistent error response format:

```javascript
{
  "status": "error",
  "error": "Error details"
}
```

Success responses follow this format:

```javascript
{
  "status": "success",
  "message": "Success message",
  "data": { /* Response data */ }
}
```

## Linting

The project uses ESLint with Airbnb and Prettier configurations. Run linting with:

```bash
npm run lint
```

## Testing

Tests can be added to the project following this structure:

```
api/
├── tests/
│   ├── controllers/
│   │   ├── contact.controller.test.js
│   │   └── users.controller.test.js
│   └── models/
│       ├── contact.model.test.js
│       └── user.model.test.js
```

## Future Improvements

- Add comprehensive test suite
- Implement request validation middleware
- Add pagination for GET endpoints
- Implement rate limiting
- Add logging middleware
- Support for file uploads
