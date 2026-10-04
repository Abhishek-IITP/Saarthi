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

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
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
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function checkDBConnection(): Promise<{ connected: boolean; uri: string; error?: string }> {
  try {
    const conn = await connectDB();
    const isConnected = conn.connection.readyState === 1;
    return { connected: isConnected, uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@") };
  } catch (err: any) {
    return {
      connected: false,
      uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
      error: err.message || "Failed to connect to MongoDB",
    };
  }
}
