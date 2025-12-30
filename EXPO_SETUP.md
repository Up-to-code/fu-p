# Expo + Start-Kit Integration Setup Guide

This guide will help you set up the complete authentication flow between your Expo app and the start-kit Next.js backend.

## 📋 Prerequisites

- Node.js 18+ or Bun installed
- MongoDB database (local or cloud)
- Expo CLI installed globally (optional): `npm install -g expo-cli`

## 🚀 Setup Steps

### 1. Expo App Configuration

#### Environment Variables

Create a `.env` file in the root of your Expo project:

```bash
EXPO_PUBLIC_AUTH_URL=http://localhost:3000
```

For production, update this to your deployed backend URL:
```bash
EXPO_PUBLIC_AUTH_URL=https://your-backend-domain.com
```

#### Verify Configuration

- ✅ Auth client is configured in `lib/auth/client.ts`
- ✅ App scheme is set to `startexpokit` in `app.json`
- ✅ Metro bundler is configured in `metro.config.js`

### 2. Start-Kit Backend Configuration

Navigate to your [start-kit repository](https://github.com/Up-to-code/start-kit) and follow these steps:

#### Install Expo Plugin

```bash
cd start-kit
bun add @better-auth/expo
```

#### Update Better Auth Configuration

Open `lib/auth/config.ts` (or the equivalent auth configuration file) and update it:

```typescript
import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
// ... other imports

export const auth = betterAuth({
  // ... existing configuration
  plugins: [
    // ... existing plugins
    expo(), // Add Expo plugin
  ],
  trustedOrigins: [
    "startexpokit://", // Your Expo app scheme
    // Development mode - Expo's exp:// scheme
    ...(process.env.NODE_ENV === "development" ? [
      "exp://",
      "exp://**",
      "exp://192.168.*.*:*/**",
    ] : [])
  ],
  // ... rest of configuration
});
```

#### Environment Variables in Start-Kit

Ensure your `.env.local` in start-kit has:

```bash
MONGODB_URI=mongodb://localhost:27017
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

MONGODB_DB_NAME=Cluster0
BETTER_AUTH_SECRET=your-secret-key-here-min-32-characters
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### 3. Running the Applications

#### Start the Next.js Backend (Start-Kit)

```bash
cd start-kit
bun dev
# or
npm run dev
```

The backend should be running on `http://localhost:3000`

#### Start the Expo App

In a new terminal:

```bash
cd start-expo-kit
bun start
# or
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web browser
- Scan QR code with Expo Go app on your device

## 📱 Testing Authentication

### Sign Up Flow

1. Open the Expo app
2. Navigate to Sign Up screen
3. Enter name, email, and password
4. Submit the form
5. You should be automatically signed in and redirected to the home screen

### Sign In Flow

1. Navigate to Sign In screen
2. Enter email and password
3. Submit the form
4. You should be redirected to the home screen

### Social Sign In (Google)

1. Navigate to Social Sign In screen
2. Tap "Continue with Google"
3. Complete OAuth flow in browser
4. You should be redirected back to the app and signed in

### Profile & Sign Out

1. Navigate to Profile screen from home
2. View your user information
3. Tap "Sign Out" to sign out
4. You should be redirected to the sign-in screen

## 🏗️ Project Structure

```
start-expo-kit/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── social-sign-in.tsx
│   ├── (home)/              # Protected home screens
│   │   ├── index.tsx
│   │   └── profile.tsx
│   └── _layout.tsx           # Root layout
├── lib/
│   ├── auth/
│   │   └── client.ts        # Auth client configuration
│   └── utils.ts             # Utility functions
├── hooks/
│   ├── use-auth.ts          # Auth hook
│   └── use-session.ts       # Session hook
└── components/
    └── auth/
        ├── auth-wrapper.tsx  # Protected route wrapper
        └── auth-form.tsx     # Reusable auth form
```

## 🔧 Troubleshooting

### Connection Issues

**Problem:** Expo app can't connect to backend

**Solutions:**
- Verify `EXPO_PUBLIC_AUTH_URL` is set correctly in `.env`
- Ensure backend is running on the correct port
- For physical devices, use your computer's local IP instead of `localhost`:
  ```bash
  EXPO_PUBLIC_AUTH_URL=http://192.168.1.100:3000
  ```

### Authentication Errors

**Problem:** Sign in/sign up fails

**Solutions:**
- Check MongoDB connection in start-kit backend
- Verify `BETTER_AUTH_SECRET` is set (min 32 characters)
- Check backend logs for error messages
- Ensure `trustedOrigins` includes your app scheme

### Deep Linking Issues

**Problem:** OAuth callback doesn't redirect back to app

**Solutions:**
- Verify app scheme in `app.json` matches `trustedOrigins` in backend
- Check that scheme is `startexpokit://` (no typos)
- For development, ensure development Expo URLs are in `trustedOrigins`

### Session Not Persisting

**Problem:** User is signed out after app reload

**Solutions:**
- Verify `expo-secure-store` is installed
- Check that SecureStore is properly configured in `lib/auth/client.ts`
- Ensure cookies are being stored correctly

## 📚 Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo)
- [Start-Kit Repository](https://github.com/Up-to-code/start-kit)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## 🎯 Next Steps

1. ✅ Set up environment variables
2. ✅ Configure start-kit backend with Expo plugin
3. ✅ Test authentication flows
4. 🔄 Add more features (password reset, email verification, etc.)
5. 🔄 Customize UI components
6. 🔄 Add more protected routes
7. 🔄 Deploy to production

## 💡 Tips

- Use `bun` for faster package installation and execution
- Keep both terminals open (backend and Expo) during development
- Use Expo DevTools for debugging
- Check network requests in browser DevTools when testing on web
- Use React Native Debugger for mobile debugging

