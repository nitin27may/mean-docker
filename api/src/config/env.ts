import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Define MongoDB connection string
const mongoUri = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}${
  process.env.MONGO_DB_PORT ? `:${process.env.MONGO_DB_PORT}` : ''
}/${process.env.MONGO_DB_DATABASE}${process.env.MONGO_DB_PARAMETERS || ''}`;

export default {
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'default-secret-for-jwt',
  mongodb: {
    uri: mongoUri
  },
  env: process.env.NODE_ENV || 'development'
};