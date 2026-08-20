import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
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

// Behind the nginx load balancer, so trust exactly one proxy hop. Without
// this, rate limiting would see every request as coming from the proxy.
app.set('trust proxy', 1);

// Security headers. Swagger UI needs inline styles and scripts, so it is
// served without the default CSP rather than weakening the policy globally.
const securityHeaders = helmet();
app.use((req, res, next) => {
  if (req.path.startsWith('/api-docs')) {
    return helmet({ contentSecurityPolicy: false })(req, res, next);
  }
  return securityHeaders(req, res, next);
});

// CORS: an explicit allowlist when CORS_ORIGINS is set. Otherwise same-origin
// only in production (everything goes through nginx there) and permissive in
// development, where Angular on :4000 calls the API on :3000.
app.use(cors({
  origin: env.corsOrigins.length > 0 ? env.corsOrigins : env.env !== 'production',
  credentials: true
}));

// Blanket rate limit. Generous enough not to interfere with normal browsing.
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  // The healthcheck polls continuously and must never be throttled.
  skip: (req) => req.path === '/health'
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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