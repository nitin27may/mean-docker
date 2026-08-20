import mongoose from 'mongoose';
import env, { redactMongoUri } from './env';

/**
 * The single entry point for the Mongo connection. Callers await this during
 * boot; connection lifecycle logging is attached here rather than at the call
 * site so there is one place to look when the database misbehaves.
 */
export const connectDB = async (): Promise<void> => {
  try {
    console.log(`Connecting to MongoDB at ${redactMongoUri(env.mongodb.uri)}`);

    await mongoose.connect(env.mongodb.uri);

    console.log('Connected to MongoDB');

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};
