import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// env loads .env as a side effect, so it must be imported before anything
// that reads configuration.
import env from './config/env';
import { connectDB } from './config/database';

// Import routes
import apiRoutes from "./routes/api.routes";

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact API',
      version: '1.0.0',
      description: 'Contact Management API documentation',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes

app.use('/api', apiRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Contact API is running');
});

// Liveness/readiness probe for Docker and Kubernetes. Reports unhealthy while
// Mongo is disconnected so orchestrators stop routing traffic here.
app.get('/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Start server only once Mongo is reachable, so the container does not sit
// there accepting traffic it cannot serve. connectDB exits on failure and
// the restart policy brings us back around.
const start = async (): Promise<void> => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

start();

export default app;