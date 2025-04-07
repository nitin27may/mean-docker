import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for Contact document
export interface IContact extends Document {
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  city?: string;
  postalCode?: string;
  create_date: Date;
}

// Create the Contact schema
const ContactSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: String,
  city: String,
  postalCode: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Contact model
const Contact: Model<IContact> = mongoose.model<IContact>('contact', ContactSchema);

export default Contact;