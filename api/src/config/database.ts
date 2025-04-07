import mongoose from 'mongoose';
import env from './env';

// Database connection function
export const connectDB = async (): Promise<void> => {
  try {
    console.log('MongoDB connection string:', env.mongodb.uri);
    
    await mongoose.connect(env.mongodb.uri);
    
    console.log('MongoDB Connected');
    
    mongoose.connection.on('error', (error) => {
      console.log('Database error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};