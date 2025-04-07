import swaggerJsDoc from 'swagger-jsdoc';
import env from './env';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact Management API',
      version: '1.0.0',
      description: 'A REST API for managing contacts with user authentication',
      contact: {
        name: 'API Support',
        email: 'support@contacts-api.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Contacts',
        description: 'Contact management endpoints'
      }
    ]
  },
  apis: ['./src/controllers/*.ts'] // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;