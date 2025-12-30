import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { expo } from "@better-auth/expo";

// Ensure database connection is available
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "Cluster0";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Create MongoDB client and connect
const client = new MongoClient(MONGODB_URI);

// Initialize connection and get database
let db: ReturnType<typeof client.db> | null = null;
let initPromise: Promise<ReturnType<typeof client.db>> | null = null;

export async function initDB() {
  if (!initPromise) {
    initPromise = (async () => {
      await client.connect();
      db = client.db(MONGODB_DB_NAME);
      return db;
    })();
  }
  return initPromise;
}

// Start connection (non-blocking)
initDB().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});

// Better-auth MongoDB configuration
// We need to ensure db is initialized before betterAuth uses it
export const auth = betterAuth({
  database: mongodbAdapter(
    // Create a db instance - it will be connected when needed
    // The adapter will handle the connection internally
    (() => {
      if (!db) {
        // If db is not initialized yet, create a temporary one
        // The actual connection will be established when the adapter uses it
        return client.db(MONGODB_DB_NAME);
      }
      return db;
    })(),
    { client }
  ),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    expo(), // Add Expo plugin for mobile app support
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "viewer",
      },
      organizationId: {
        type: "string",
        required: false,
      },
    },
  },
  trustedOrigins: [
    "startexpokit://", // Your Expo app scheme
    // Development mode - Expo's exp:// scheme
    ...(process.env.NODE_ENV === "development" ? [
      "exp://",
      "exp://**",
      "exp://192.168.*.*:*/**",
    ] : [])
  ],
  secret: process.env.BETTER_AUTH_SECRET || "change-me-in-production",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
});

