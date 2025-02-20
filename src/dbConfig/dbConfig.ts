//  In this also changes are made for the deployment

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGO_URI || "";

if (!MONGODB_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables!");
}

// Define a proper type for caching the connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use global object with correct typing
const globalWithMongoose = global as typeof global & { mongoose?: MongooseCache };

// Use existing global cache or create a new one
const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

export async function connect(): Promise<Mongoose> {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection.");
    return cached.conn; // Return existing connection
  }

  if (!cached.promise) {
    console.log("📡 Connecting to MongoDB...");
    console.log(MONGODB_URI);

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // Avoid memory issues
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;

  // Store the cache globally to prevent multiple connections
  globalWithMongoose.mongoose = cached;

  return cached.conn;
}
