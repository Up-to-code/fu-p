import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "@/lib/db/drizzle";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
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
        defaultValue: "owner",
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
