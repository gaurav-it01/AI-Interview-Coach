import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  const atlasUri = process.env.MONGO_URI?.trim();
  const allowMemoryDb = process.env.ALLOW_MEMORY_DB === 'true';

  if (atlasUri) {
    try {
      const conn = await mongoose.connect(atlasUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB connected to Atlas: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error('Atlas connection failed:', error.message);
      if (!allowMemoryDb) {
        process.exit(1);
      }
    }
  }

  if (!allowMemoryDb) {
    console.error('MONGO_URI is missing. Set ALLOW_MEMORY_DB=true only for local demos.');
    process.exit(1);
  }

  try {
    const mongod = await MongoMemoryServer.create();
    const conn = await mongoose.connect(mongod.getUri());
    console.log(`MongoDB connected (In-Memory): ${conn.connection.host}`);
  } catch (error) {
    console.error('Final database connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
