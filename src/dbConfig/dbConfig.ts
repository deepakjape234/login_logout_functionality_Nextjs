import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI || "";

if (!MONGODB_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables!");
}

// Global cache for connection (prevents multiple connections)
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connect() {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection.");
    return cached.conn; // Return existing connection
  }

  if (!cached.promise) {
    console.log("📡 Connecting to MongoDB...");
    console.log(MONGODB_URI);
    cached.promise = mongoose.connect (MONGODB_URI, {
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
  return cached.conn;
}
