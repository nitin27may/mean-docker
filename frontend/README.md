# Frontend (Angular)

This directory contains the Angular frontend application for the MEAN Stack Contacts System.

## Features

- **Angular 19**: Latest version with performance improvements
- **TypeScript**: For enhanced type safety and developer experience
- **Bootstrap 5**: For responsive design and UI components
- **JWT Authentication**: Secure user login and registration
- **Lazy Loading**: For optimized module loading
- **Angular SSR**: Server-side rendering for improved SEO and performance
- **Reactive Forms**: With custom validation
- **NgBootstrap**: Enhanced Bootstrap components for Angular
- **Form Validation**: Custom error handling and display

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── @core/             # Core module (guards, interceptors, services)
│   │   │   ├── components/    # Shared components
│   │   │   ├── guards/        # Authentication guards
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   ├── layout/        # Application layout components
│   │   │   ├── models/        # Data models and interfaces
│   │   │   └── services/      # Core services
│   │   ├── feature/           # Feature modules
│   │   │   ├── contact/       # Contact management feature
│   │   │   └── user/          # User management feature
│   │   ├── app.component.ts   # Root component
│   │   ├── app.config.ts      # Application configuration
│   │   └── app.routes.ts      # Main routing configuration
│   ├── assets/                # Static assets
│   ├── environments/          # Environment configurations
│   └── styles.css             # Global styles
├── Dockerfile                 # Docker configuration
├── angular.json               # Angular configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
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

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

Install dependencies:
```bash
npm install
```

### Running Development Server

```bash
# Development server with hot reload
npm start

# Development server with API proxy
npm run serve
```

The application will be available at `http://localhost:4200`.

### Building

```bash
# Development build
npm run build

# Production build with SSR
npm run build:prod
```

Build artifacts will be stored in the `dist/` directory.

## Docker Support

### Development Dockerfile

For development with hot reloading:

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

For production builds with SSR:

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

## Features in Detail

### Core Module

The `@core` module contains:

- **Guards**: Authentication protection for routes
- **Interceptors**: HTTP request/response transformations
- **Services**: Shared services like authentication and validation
- **Layout**: Common layout components (header, footer)
- **Models**: TypeScript interfaces for data models

### Feature Modules

Feature modules are organized by domain:

- **Contact**: All components related to contact management
- **User**: Components for user authentication and profile management

### Routing Structure

The application uses a modular routing approach:

- Root routes define the basic application structure
- Feature modules have their own route configurations
- Lazy loading is used for feature modules

### Form Validation

Custom form validation is implemented using:

- Reactive forms with validators
- Custom validation service
- Error tailor directives
- Consistent error display

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

## Authentication Flow

1. User submits login credentials
2. LoginService makes API call to `/api/user/authenticate`
3. On successful authentication, JWT token is stored in localStorage
4. JwtInterceptor adds token to all subsequent API requests
5. AuthGuard checks token validity for protected routes
6. LogoutService removes token and redirects to login

## Testing

```bash
# Run unit tests
npm test
```

The testing framework uses:
- Jasmine for test specification
- Karma as the test runner
- Angular TestBed for component testing
