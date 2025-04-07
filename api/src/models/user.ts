import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  token?: string;
  email?: string;
  mobile?: string;
  create_date: Date;
}

// Create the User schema
const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: String,
  email: String,
  mobile: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});

// Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('user', UserSchema);

export default User;