import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;
if (!MONGODB_URI) throw new Error("Please define MONGO_URI");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: true, maxPoolSize: 10 })
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("Failed to connect to MongoDB: " + error);
  }

  return cached.conn;
}

export async function getMongoClient() {
  if (!cached.conn) await connectToDB();
  if (!cached.conn) throw new Error("MongoDB connection is not established.");
  return cached.conn.getClient();
}
