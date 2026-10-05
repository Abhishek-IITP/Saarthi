import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/saarthi";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

let lastFailedAt = 0;
let lastFailureError = "";

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (Date.now() - lastFailedAt < 30000) {
    throw new Error(lastFailureError || "MongoDB connection failed recently (cooldown active)");
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    lastFailedAt = 0;
  } catch (e: any) {
    cached.promise = null;
    lastFailedAt = Date.now();
    lastFailureError = e.message || "Failed to connect to MongoDB";
    throw e;
  }

  return cached.conn;
}

export async function checkDBConnection(): Promise<{ connected: boolean; uri: string; error?: string }> {
  // If connection failed recently, return cached offline status immediately instead of blocking for 2s
  if (Date.now() - lastFailedAt < 30000) {
    return {
      connected: false,
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
      error: lastFailureError,
    };
  }

  try {
    const conn = await connectDB();
    const isConnected = conn.connection.readyState === 1;
    lastFailedAt = 0;
    return { connected: isConnected, uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@") };
  } catch (err: any) {
    lastFailedAt = Date.now();
    lastFailureError = err.message || "Failed to connect to MongoDB";
    return {
      connected: false,
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
      error: lastFailureError,
    };
  }
}
