import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env when running outside a container.
// In Docker the values arrive from compose, so a missing file is not an error.
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

/**
 * The MongoDB connection string is assembled in exactly one place. A full
 * MONGODB_URI wins when supplied, which is what managed MongoDB services hand
 * you; otherwise it is built from the discrete MONGO_DB_* variables that the
 * compose files pass in.
 */
const buildMongoUri = (): string => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const username = process.env.MONGO_DB_USERNAME;
  const password = process.env.MONGO_DB_PASSWORD;
  const host = process.env.MONGO_DB_HOST;
  const port = process.env.MONGO_DB_PORT ? `:${process.env.MONGO_DB_PORT}` : '';
  const database = process.env.MONGO_DB_DATABASE;
  const parameters = process.env.MONGO_DB_PARAMETERS || '';

  return `mongodb://${username}:${password}@${host}${port}/${database}${parameters}`;
};

// The placeholder that ships in .env.example. Booting with it means every
// deployment that followed the README quick-start would share a signing key
// that is published in this repository.
const PLACEHOLDER_SECRET = 'your-jwt-secret-key';

/**
 * The JWT signing key is required. There is deliberately no fallback: a silent
 * default would be a publicly-known key, which is worse than refusing to boot.
 */
const requireSecret = (): string => {
  const secret = process.env.SECRET;

  if (!secret || secret === PLACEHOLDER_SECRET) {
    throw new Error(
      'SECRET is missing or still set to the .env.example placeholder. ' +
      'Generate one with:  openssl rand -base64 48'
    );
  }

  if (secret.length < 32) {
    throw new Error('SECRET must be at least 32 characters. Generate one with:  openssl rand -base64 48');
  }

  return secret;
};

/**
 * Strips credentials from a connection string so it can be logged safely.
 * Falls back to a constant rather than risking a leak if parsing fails.
 */
export const redactMongoUri = (uri: string): string => {
  try {
    const parsed = new URL(uri);
    parsed.username = '';
    parsed.password = '';
    return parsed.toString();
  } catch {
    return 'mongodb://<unparseable-uri>';
  }
};

export default {
  port: Number(process.env.PORT) || 3000,
  secret: requireSecret(),
  mongodb: {
    uri: buildMongoUri()
  },
  env: process.env.NODE_ENV || 'development',
  // Comma-separated allowlist. Empty means same-origin only in production
  // (the nginx mode proxies everything through one origin) and any origin in
  // development, where Angular on :4000 calls the API on :3000.
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
};
