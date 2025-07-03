import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'ongodb+srv://ndanyuzwep02:HQvORnb4yVqDucV5@ridra.cdohdhu.mongodb.net/?retryWrites=true&w=majority&appName=ridra';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;