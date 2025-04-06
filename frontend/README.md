# Frontend (Angular)

This directory contains the Angular frontend application for the MEAN Stack Contacts System.

## Technology Stack

- **Angular**: v19.0.3
- **Bootstrap**: v5.3.2
- **NgBootstrap**: v17.0.0
- **Angular SSR**: Enabled for production builds
- **Form Validation**: Custom error tailor module

## Development Server

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`. The app will automatically reload if you change any of the source files.

### Combined Frontend and API

```bash
# Start both frontend and API
npm run dev-server
```

This will start the frontend at `http://localhost:4200` and API at `http://localhost:3000`.

## Project Structure

```
src/
├── app/
│   ├── @core/               # Core module (guards, interceptors, services)
│   │   ├── components/      # Shared components
│   │   ├── guards/          # Authentication guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── layout/          # Application layout components
│   │   ├── models/          # Data models and interfaces
│   │   └── services/        # Core services
│   ├── feature/             # Feature modules
│   │   ├── contact/         # Contact management feature
│   │   └── user/            # User management feature
│   ├── app.component.ts     # Root component
│   ├── app.config.ts        # Application configuration
│   └── app.routes.ts        # Main routing configuration
├── assets/                  # Static assets
├── environments/            # Environment configurations
└── styles.css               # Global styles
```

## Key Features

### Authentication

The application uses JWT-based authentication with token storage in localStorage. Key components:

- `UserService`: Handles user data and operations
- `LoginService`: Manages authentication
- `AuthGuard`: Protects routes from unauthorized access
- `JwtInterceptor`: Adds JWT token to outgoing requests

### Contact Management

Complete CRUD operations for contact management:

- `ContactListComponent`: Displays paginated contacts
- `ContactFormComponent`: Handles create/edit contact
- `ContactDetailsComponent`: Shows contact details
- `ContactService`: Manages API calls for contacts

### Form Validation

Custom validation implemented with error tailor module:

- `ValidationService`: Custom validators
- Error display with custom messages
- Cross-field validation

### Layout

Responsive layout with Bootstrap 5:

- Header with navigation
- Footer with links
- Content area with responsive sizing

## Building

```bash
# Development build
npm run build

# Production build with SSR
npm run build:prod
```

Build artifacts will be stored in the `dist/` directory.

## Docker Support

### Development Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install -g @angular/cli

COPY . /app/

EXPOSE 4200 49153
```

### Production Dockerfile

```dockerfile
FROM node:22-alpine as builder

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . /app/

RUN npm run build

FROM node:22-alpine
COPY --from=builder /app /app

WORKDIR /app
EXPOSE 4000

USER node

CMD ["node", "dist/contacts/server/server.mjs"]
```

## Testing

```bash
# Run unit tests
npm test
```

## Future Improvements

- Add service worker for offline support
- Implement state management with NgRx
- Increase test coverage
- Add end-to-end testing with Cypress

## Environment Configuration

The application uses environment files for configuration:

- `environment.ts`: Development environment
- `environment.prod.ts`: Production environment

Key configuration options:

```typescript
export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:3000/api',
  angular: 'Angular 19',
  bootstrap: 'Bootstrap 5',
  expressjs: 'Express.js 4.17.1',
  mongoDb: 'MongoDB 7.0',
};
```

## Proxy Configuration

During development, API calls are proxied to the backend using `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "logLevel": "debug"
  }
}
```
