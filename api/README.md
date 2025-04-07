# Contact Management API

A RESTful API for managing contacts, built with TypeScript, Express.js, and MongoDB.

## Features

- User authentication with JWT
- CRUD operations for contacts
- MongoDB database integration
- API documentation with Swagger
- TypeScript for type safety

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/contact-api-ts.git
   cd contact-api-ts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3000
   SECRET=your_jwt_secret
   MONGO_DB_USERNAME=your_mongodb_username
   MONGO_DB_PASSWORD=your_mongodb_password
   MONGO_DB_HOST=localhost
   MONGO_DB_PORT=27017
   MONGO_DB_DATABASE=contacts_db
   MONGO_DB_PARAMETERS=?authSource=admin
   ```

### Development

Start the development server:
```bash
npm run dev:watch
```

### Build and Run Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Documentation

Swagger documentation is available at: `http://localhost:3000/api-docs`

## API Endpoints

### Authentication

- `POST /api/user/authenticate` - Login and get JWT token

### Users

- `GET /api/users` - Get all users (requires authentication)
- `POST /api/users` - Create a new user
- `GET /api/user/:id` - Get user by ID (requires authentication)
- `PUT /api/user/:id` - Update user (requires authentication)
- `DELETE /api/user/:id` - Delete user (requires authentication)
- `PUT /api/user/changepassword/:id` - Change user password (requires authentication)

### Contacts

- `GET /api/contacts` - Get all contacts (requires authentication)
- `POST /api/contacts` - Create a new contact (requires authentication)
- `GET /api/contact/:id` - Get contact by ID (requires authentication)
- `PUT /api/contact/:id` - Update contact (requires authentication)
- `DELETE /api/contact/:id` - Delete contact (requires authentication)

## Project Structure

```
contact-api-ts/
├── dist/               # Compiled JavaScript files
├── src/                # TypeScript source files
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middlewares/    # Custom middlewares
│   ├── models/         # Mongoose models
│   ├── routes/         # Route definitions
│   ├── utils/          # Utility functions
│   └── server.ts       # Entry point
├── .env                # Environment variables
├── .gitignore          # Gitignore file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## License

This project is licensed under the MIT License.