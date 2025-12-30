import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "Cluster0";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

function getConnectionString(uri: string, dbName: string): string {
  // Remove any existing database name from the URI
  // MongoDB URIs format: mongodb://host:port/dbname?options
  // or mongodb+srv://user:pass@host/dbname?options
  
  // Split by ? to separate options
  const [baseUri, options] = uri.split("?");
  
  // Remove database name if it exists (after the last /)
  const parts = baseUri.split("/");
  const connectionBase = parts.slice(0, -1).join("/");
  
  // Build new URI with the specified database name
  const newUri = `${connectionBase}/${dbName}${options ? `?${options}` : ""}`;
  
  return newUri;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME, // Specify database name in connection options
    };

    // Build connection string with database name
    const connectionString = getConnectionString(MONGODB_URI!, MONGODB_DB_NAME);

    cached.promise = mongoose.connect(connectionString, opts).then((mongoose) => {
      return mongoose;
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

export default connectDB;

